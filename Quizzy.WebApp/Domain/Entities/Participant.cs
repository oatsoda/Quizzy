using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Quizzy.WebApp.Data.Entities
{
    public class Participant
    {
        public const string DiscriminatorValue = "Participant";

        [JsonProperty("id")]
        public Guid Id { get; }
        public string CompId { get; }
        public string Discriminator => DiscriminatorValue;

        public string Email { get; }
        public string Name { get; set; }

        public bool IsConnected { get; private set; }
        public string ClientId { get; private set; }

        public int TotalAnswers { get; private set; }
        public int CorrectAnswers { get; private set; }

        // TODO: Make read only 
        public Dictionary<int, ParticipantAnswer> Answers { get; }

        public Participant(string competitionCode, string email)
        {
            Id = Guid.NewGuid();
            CompId = competitionCode;
            Email = email;
            Answers = new Dictionary<int, ParticipantAnswer>();
        }

        [JsonConstructor]
        private Participant(Guid id, string compId, string email, bool isConnected, string clientId, Dictionary<int, ParticipantAnswer> answers)
        {
            Id = id;
            CompId = compId;
            Email = email;
            IsConnected = isConnected;
            ClientId = clientId;
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

            TotalAnswers = Answers.Count;
            CorrectAnswers = Answers.Values.Count(a => a.IsCorrect);
        }

        public void Connected(string clientId)
        {
            IsConnected = true;
            ClientId = clientId;
        }

        public void Disconnected() => IsConnected = false;
    }
}
