using Quizzy.WebApp.Data.Entities;
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

        public Task LeftQuiz(string code, Participant participant)
        {
            var liveQuiz = m_LiveQuizzes.GetOrAdd(code, _ => m_LiveQuizFactory());
            return liveQuiz.Left(participant);
        }
        
        public Task AnswerQuestion(Answer answer)
        {
            var liveQuiz = m_LiveQuizzes.GetOrAdd(answer.CompetitionCode, _ => m_LiveQuizFactory());
            return liveQuiz.AnswerQuestion(answer.ParticipantId, answer.QuestionNo, answer.AnswerNo);
        }
    }
}
