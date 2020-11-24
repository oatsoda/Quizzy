using System;
using Newtonsoft.Json;

namespace Quizzy.WebApp.Data.Entities
{
    public class Quiz
    {
        [JsonProperty("id")]
        public string Id { get; }
        public string PartKey { get; }
        public string Name { get; }
        public string CreatorEmail { get; }
        public string CreatorName { get; set; }

        public Quiz(string name, string creatorEmail)
        {
            Id = Guid.NewGuid().ToString(); // TODO: Shorten, make friendlier
            PartKey = CreatePartitionKeyFromId(Id);
            Name = name;
            CreatorEmail = creatorEmail;
        }

        [JsonConstructor]
        private Quiz(string id, string partKey, string name, string creatorEmail)
        {
            Id = id;
            PartKey = partKey;
            Name = name;
            CreatorEmail = creatorEmail;
        }

        public static string CreatePartitionKeyFromId(string id) =>  id[0].ToString();
    }
}
