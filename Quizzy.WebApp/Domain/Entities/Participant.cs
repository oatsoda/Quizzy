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

        public Dictionary<int, ParticipantAnswer> Answers { get; }


        public Participant(string competitionCode, string email)
        {
            Id = Guid.NewGuid();
            CompId = competitionCode;
            Email = email;
            Answers = new Dictionary<int, ParticipantAnswer>();
        }

        [JsonConstructor]
        private Participant(Guid id, string compId, string email, Dictionary<int, ParticipantAnswer> answers)
        {
            Id = id;
            CompId = compId;
            Email = email;
            Answers = answers;
        }

        public void Answer(int questionNo, int answer, bool isCorrect)
        {
            Answers[questionNo] = new ParticipantAnswer
            {
                Q = questionNo,
                A = answer,
                IsCorrect = isCorrect
            };
        }
    }

    public class ParticipantAnswer
    {
        public int Q { get; set; }
        public int A { get; set; }
        public bool IsCorrect { get; set; }
    }
}
