using System;

namespace Quizzy.WebApp.QuizProcess
{
    public class LiveParticipant
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool AnsweredCurrent { get; set; }
        public bool IsConnected { get; set; }
    }

}
