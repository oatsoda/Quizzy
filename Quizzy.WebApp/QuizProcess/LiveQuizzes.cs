using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.Cosmos;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace Quizzy.WebApp.QuizProcess
{
    public class LiveQuizzes
    {
        private readonly Func<LiveQuiz> m_LiveQuizFactory;

        private readonly ConcurrentDictionary<string, LiveQuiz> m_LiveQuizzes = new ConcurrentDictionary<string, LiveQuiz>();

        public LiveQuizzes(Func<LiveQuiz> liveQuizFactory)
        {
            m_LiveQuizFactory = liveQuizFactory;
        }

        //public LiveQuiz GetLiveQuiz(string code)
        //{
        //    return m_LiveQuizzes[code];
        //}

        public Task OpenQuiz(Competition competition)
        {
            var liveQuiz = m_LiveQuizzes.GetOrAdd(competition.Code, _ => m_LiveQuizFactory());
            return liveQuiz.Open(competition);            
        }

        public Task StartQuiz(Competition competition)
        {
            var liveQuiz = m_LiveQuizzes.GetOrAdd(competition.Code, _ => m_LiveQuizFactory());
            return liveQuiz.Start(competition);            
        }

        public Task<JoinConfirmed> JoinQuiz(string code, Participant participant, string clientId)
        {
            var liveQuiz = m_LiveQuizzes.GetOrAdd(code, _ => m_LiveQuizFactory());
            return liveQuiz.Join(participant, clientId);
        }
        
        public Task AnswerQuestion(Answer answer)
        {
            var liveQuiz = m_LiveQuizzes.GetOrAdd(answer.CompetitionCode, _ => m_LiveQuizFactory());
            return liveQuiz.AnswerQuestion(answer.ParticipantId, answer.QuestionNo, answer.AnswerNo);
        }
    }

    public class LiveQuiz
    {
        private object m_Locker = new object();

        private readonly ParticipantNotifier m_ParticipantNotifier;
        private readonly IMapper m_Mapper;
        private readonly DataQuery m_DataQuery;
        private readonly DataStore m_DataStore;
        private Competition m_Competition;
        private Quiz m_Quiz;

        private bool m_IsRecovering = true;

        private int TotalQuestions => m_Quiz.Questions.Count;
        private int CurrentQuestion => m_Competition.CurrentQuestion;
        private bool IsLastQuestion => CurrentQuestion == TotalQuestions;

        public LiveQuiz(ParticipantNotifier participantNotifier, IMapper mapper, DataQuery dataQuery, DataStore dataStore)
        {
            m_ParticipantNotifier = participantNotifier;
            m_Mapper = mapper;
            m_DataQuery = dataQuery;
            m_DataStore = dataStore;
        }

        public async Task Open(Competition competition)
        {
            m_IsRecovering = false;
            m_Competition = competition;
            m_Quiz = await m_DataQuery.FetchSingle<Quiz>(q => q.Id == competition.QuizId, Quiz.CreatePartitionKeyFromId(competition.QuizId));
        }

        public async Task Start(Competition competition)
        {
            m_IsRecovering = false;
            m_Competition = competition;
            m_Quiz ??= await m_DataQuery.FetchSingle<Quiz>(q => q.Id == competition.QuizId, Quiz.CreatePartitionKeyFromId(competition.QuizId));

            await m_ParticipantNotifier.NotifyStarted(competition.Code, GetCurrentQuestion());
        }

        public async Task<JoinConfirmed> Join(Participant participant, string clientId)
        {
            LoadIfRecovering(participant.CompId);
            // TODO: Record SignalR connection ID?

            var confirmation = new JoinConfirmed { Participants = new ParticipantList() };
            if (m_Competition.Status == CompetitionStatus.Started)
                confirmation.Question = GetCurrentQuestion();
            return confirmation;
        }

        public async Task AnswerQuestion(Guid participantId, int questionNo, int answerNo)
        {
            var participant = await m_DataStore.Fetch<Participant>(participantId.ToString(), m_Competition.Code);
            participant.Answer(questionNo, answerNo, m_Quiz.Questions[questionNo - 1].CorrectA == answerNo);
            
            // TODO: This lock is not distributed across all server instances. If we added timer to move to
            // next question (someone disconnected not answering) then would we change this anyway?
            lock (m_Locker)
            {
                // Avoid race condition here as two (final) answers would both check AllAnswered and both could then trigger
                // MoveToNextQuestion (because both have already updated DB)

                m_DataStore.Update(participant, participant.Id.ToString(), m_Competition.Code).GetAwaiter().GetResult();
            
                if (!AllAnswered().GetAwaiter().GetResult())
                    return;
            }

            // If this is the Last Participant to Answers, move on to next, else finish
            if (IsLastQuestion)            
                await Finish();            
            else            
                await MoveToNextQuestion();
        }

        private Question GetCurrentQuestion()
        {
            // TODO: Cache map results
            var question = m_Mapper.Map<Question>(m_Quiz.Questions[CurrentQuestion - 1]);
            question.No = CurrentQuestion;
            question.Total = TotalQuestions;
            return question;
        }

        private void LoadIfRecovering(string code)
        {
            // Recovering means Server has restarted so Open/Started quiz has not yet been loaded
            if (m_IsRecovering)
            {
                lock (m_Locker)
                {
                    if (m_IsRecovering)
                    {
                        m_Competition = m_DataQuery.FetchSingle<Competition>(q => q.Code == code, code).GetAwaiter().GetResult();
                        m_Quiz = m_DataQuery.FetchSingle<Quiz>(q => q.Id == m_Competition.QuizId, Quiz.CreatePartitionKeyFromId(m_Competition.QuizId)).GetAwaiter().GetResult();
                        m_IsRecovering = false;
                    }
                }
            }
        }

        private async Task<bool> AllAnswered()
        {
            // TODO: Why is quNo param not working (Due to double quotes?)
            var query = new QueryDefinition($"SELECT VALUE COUNT(c) FROM c WHERE c.CompId = @code and c.Discriminator = @disc and not IS_DEFINED(c.Answers[\"{CurrentQuestion}\"])")
                .WithParameter("@code", m_Competition.Code)
                .WithParameter("@disc", Participant.DiscriminatorValue)
                .WithParameter("@quNo", CurrentQuestion);

            var notAnsweredCount = await m_DataQuery.FetchSingle<Participant, int>(query, m_Competition.Code);
            return notAnsweredCount == 0;
        }

        private async Task MoveToNextQuestion()
        {
            m_Competition.CurrentQuestion++;
            m_Competition = await m_DataStore.Update(m_Competition, m_Competition.Code, m_Competition.Code);
            await m_ParticipantNotifier.NotifyNextQuestion(m_Competition.Code, GetCurrentQuestion());
        }

        private async Task Finish()
        {
            // Should we clear up - do we need to keep this  instance in mem?
            m_Competition.Finish();
            m_Competition = await m_DataStore.Update(m_Competition, m_Competition.Code, m_Competition.Code);
            await m_ParticipantNotifier.NotifyFinished(m_Competition.Code);
        }
    }

  

    public class ParticipantNotifier
    {
        private readonly IHubContext<QuizHub, IQuizHub> m_HubContext;

        public ParticipantNotifier(IHubContext<QuizHub, IQuizHub> hubContext)
        {
            m_HubContext = hubContext;
        }

        //public Task NotifyJoinConfirmed(Competition competition, IQuizHub caller)
        //{
        //    var response = new JoinConfirmed { Participants = new ParticipantList() };
        //    if (competition.)
        //    var question = m_Mapper.Map<Question>(quiz.Questions[0]);
        //    question.No = 1;
        //    question.Total = quiz.Questions.Count;
        //    return caller.Started(question);
        //}

        public Task NotifyStarted(string code, Question firstQuestion)
        {
            return m_HubContext.Clients.Group(code).Started(firstQuestion);
        }

        public Task NotifyNextQuestion(string code, Question question)
        {
            return m_HubContext.Clients.Group(code).NewQuestion(question);
        }

        public Task NotifyFinished(string code)
        {
            return m_HubContext.Clients.Group(code).Finished();
        }
    }
}
