using System;
using Newtonsoft.Json;
using Quizzy.WebApp.Domain.AbstractServices;

namespace Quizzy.WebApp.Data.Entities
{
    public class Competition
    {
        [JsonProperty("id")]
        public string Code { get; }
        public string CompId => Code;
        public string Discriminator => "Competition";

        public CompetitionStatus Status { get; private set; }
        public int CurrentQuestion { get; private set; }

        public Guid QuizId { get; set; }

        public Competition(Guid quizId, ICompetitionCodeGenerator competitionCodeGenerator)
        {
            Code = competitionCodeGenerator.GenerateUniqueCode();
            Status = CompetitionStatus.New;
            QuizId = quizId;
        }

        [JsonConstructor]
        private Competition(string code, CompetitionStatus status, int currentQuestion, Guid quizId)
        {
            Code = code;
            Status = status;
            CurrentQuestion = currentQuestion;
            QuizId = quizId;
        }

        public void Open() 
        {
            if (Status != CompetitionStatus.New)
                throw new InvalidOperationException($"Cannot Open when status is not New. Status is '{Status}'");

            Status = CompetitionStatus.Open;
        }
        
        public void Start() 
        {
            if (Status != CompetitionStatus.Open)
                throw new InvalidOperationException($"Cannot Start when status is not Open. Status is '{Status}'");

            Status = CompetitionStatus.Started;
            CurrentQuestion = 1;
        }
        
        public void Finish() 
        {
            if (Status != CompetitionStatus.Started)
                throw new InvalidOperationException($"Cannot Finish when status is not Started. Status is '{Status}'");

            Status = CompetitionStatus.Finished;
        }  
    }
}
