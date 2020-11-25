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

    public class QuizQuestion
    {
        public string Question { get; set; }
        public string Answer1 { get; set; }
        public string Answer2 { get; set; }
        public string Answer3 { get; set; }
        public string Answer4 { get; set; }
        public int CorrectAnswer { get; set; }
    }

    public class Competition
    {
        [JsonProperty("id")]
        public string Code { get; }
        public string CompId => Code;
        public CompetitionStatus Status { get; }

        public Guid QuizId { get; set; }

        public Competition(Guid quizId)
        {
            Code = Guid.NewGuid().ToString(); // TODO: Make shorter, friendlier
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

    public class Participant
    {
        [JsonProperty("id")]
        public Guid Id { get; }
        public string Name { get; }
        public string Email { get; }

        public List<Answer> Answers { get; }

        public class Answer
        {
            public int Q { get; set; }
            public int A { get; set; }
            public bool IsCorrect { get; set; }
        }
    }

    public enum CompetitionStatus
    {
        None,
        WaitingForParticipants,
        Started,
        Finished
    }
}
