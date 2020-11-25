using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Quizzy.WebApp.Data.Entities
{
    public class Quiz
    {
        [JsonProperty("id")]
        public Guid Id { get; }
        public string PartKey { get; }
        public string Name { get; }
        public string CreatorEmail { get; }
        public string CreatorName { get; set; }

        public List<QuizQuestion> Questions { get; }

        public Quiz(string name, string creatorEmail)
        {
            Id = Guid.NewGuid();
            PartKey = CreatePartitionKeyFromId(Id);
            Name = name;
            CreatorEmail = creatorEmail;
            Questions = new List<QuizQuestion>();
        }

        [JsonConstructor]
        private Quiz(Guid id, string partKey, string name, string creatorEmail, List<QuizQuestion> questions)
        {
            Id = id;
            PartKey = partKey;
            Name = name;
            CreatorEmail = creatorEmail;
            Questions = questions;
        }

        public static string CreatePartitionKeyFromId(Guid id) =>  id.ToString().Substring(0, 1);
    }
}
