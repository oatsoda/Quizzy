using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Quizzy.WebApp.Data.Entities
{
    public class Participant
    {
        [JsonProperty("id")]
        public Guid Id { get; }
        public string CompId { get; }
        public string Discriminator => "Participant";

        public string Email { get; }
        public string Name { get; set; }

        public List<Answer> Answers { get; }

        public class Answer
        {
            public int Q { get; set; }
            public int A { get; set; }
            public bool IsCorrect { get; set; }
        }

        public Participant(string competitionCode, string email)
        {
            Id = Guid.NewGuid();
            CompId = competitionCode;
            Email = email;
            Answers = new List<Answer>();
        }

        [JsonConstructor]
        private Participant(Guid id, string compId, string email)
        {
            Id = id;
            CompId = compId;
            Email = email;
        }
    }
}
