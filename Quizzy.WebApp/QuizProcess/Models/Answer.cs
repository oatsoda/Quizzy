using System;

namespace Quizzy.WebApp.QuizProcess
{
    public class Answer
    {
        public string CompetitionCode { get; set; }
        public Guid ParticipantId { get; set; }
        public int QuestionNo { get; set; }
        public int AnswerNo { get; set; }
    }

}
