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
        public CompetitionStatus Status { get; }

        public Guid QuizId { get; set; }

        public Competition(Guid quizId, ICompetitionCodeGenerator competitionCodeGenerator)
        {
            Code = competitionCodeGenerator.GenerateUniqueCode();
            Status = default;
            QuizId = quizId;
        }

        [JsonConstructor]
        private Competition(string code, CompetitionStatus status, Guid quizId)
        {
            Code = code;
            Status = status;
            QuizId = quizId;
        }

        // TODO: Status change methods
    }
}
