using AutoMapper;
using Microsoft.Azure.Cosmos;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizzy.WebApp.QuizProcess
{
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
            participant.Connected(clientId);
            await m_DataStore.Update(participant, participant.Id.ToString(), m_Competition.Code);

            var participantList = new ParticipantList { Participants = await GetParticipants() };
            var confirmation = new JoinConfirmed { Participants = participantList };

            if (m_Competition.Status == CompetitionStatus.Started)
            {
                confirmation.Question = GetCurrentQuestion();
                confirmation.CurrentQuestionAnswer = participant.Answers.ContainsKey(CurrentQuestion) ? participant.Answers[CurrentQuestion]?.A : null;
            }

            await m_ParticipantNotifier.NotifyParticipantsChanged(participant.CompId, participantList, clientId);

            return confirmation;
        }

        public async Task Left(Participant participant)
        {
            participant.Disconnected();
            await m_DataStore.Update(participant, participant.Id.ToString(), m_Competition.Code);
            
            // TODO: Caching of participants
            var participantList = new ParticipantList { Participants = await GetParticipants() };
            await m_ParticipantNotifier.NotifyParticipantsChanged(m_Competition.Code, participantList);

        }

        public async Task AnswerQuestion(Guid participantId, int questionNo, int answerNo)
        {
            var participant = await m_DataStore.Fetch<Participant>(participantId.ToString(), m_Competition.Code);
            participant.Answer(questionNo, answerNo, m_Quiz.Questions[questionNo - 1].CorrectA == answerNo);
            
            // TODO: This lock is not distributed across all server instances. If we added timer to move to
            // next question (someone disconnected not answering) then would we change this anyway?
            bool allAnswered = false;
            lock (m_Locker)
            {
                // Avoid race condition here as two (final) answers would both check AllAnswered and both could then trigger
                // MoveToNextQuestion (because both have already updated DB)

                m_DataStore.Update(participant, participant.Id.ToString(), m_Competition.Code).GetAwaiter().GetResult();
            
                allAnswered = AllAnswered().GetAwaiter().GetResult();
            }

            if (!allAnswered)
            {
                await RefreshNotifyParticipants();
                return;
            }

            // If this is the Last Participant to Answers, move on to next, else finish
            if (IsLastQuestion)            
                await Finish();            
            else            
                await MoveToNextQuestion();
        }

        private async Task RefreshNotifyParticipants()
        {
            // TODO: Caching of participants
            var participantList = new ParticipantList { Participants = await GetParticipants() };
            await m_ParticipantNotifier.NotifyParticipantsChanged(m_Competition.Code, participantList);
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
            // TODO: Filtering by connected, but probably remove and have a max time limit.
            var query = new QueryDefinition($"SELECT VALUE COUNT(c) FROM c WHERE c.CompId = @code AND c.Discriminator = @disc AND c.IsConnected = true AND NOT IS_DEFINED(c.Answers[@quNo])")
                .WithParameter("@code", m_Competition.Code)
                .WithParameter("@disc", Participant.DiscriminatorValue)
                .WithParameter("@quNo", CurrentQuestion.ToString()); // Have to ToString it as c.Answers[@quNo] requires string

            var notAnsweredCount = await m_DataQuery.FetchSingle<Participant, int>(query, m_Competition.Code);
            return notAnsweredCount == 0;
        }

        private async Task<List<LiveParticipant>> GetParticipants()
        {
            var query = new QueryDefinition($"SELECT c.id, c.Name, IS_DEFINED(c.Answers[@quNo]) AS answeredCurrent, c.IsConnected FROM c WHERE c.CompId = @code and c.Discriminator = @disc")
                .WithParameter("@code", m_Competition.Code)
                .WithParameter("@disc", Participant.DiscriminatorValue)
                .WithParameter("@quNo", CurrentQuestion.ToString()); // Have to ToString it as c.Answers[@quNo] requires string
                        
            return await m_DataQuery.FetchAll<Participant, LiveParticipant>(query, m_Competition.Code);
        }

        private async Task MoveToNextQuestion()
        {
            m_Competition.CurrentQuestion++;
            m_Competition = await m_DataStore.Update(m_Competition, m_Competition.Code, m_Competition.Code);
            await m_ParticipantNotifier.NotifyNextQuestion(m_Competition.Code, GetCurrentQuestion());
            await RefreshNotifyParticipants();
        }

        private async Task Finish()
        {
            // Should we clear up - do we need to keep this  instance in mem?
            m_Competition.Finish();
            m_Competition = await m_DataStore.Update(m_Competition, m_Competition.Code, m_Competition.Code);
            await m_ParticipantNotifier.NotifyFinished(m_Competition.Code);
        }
    }
}
