using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizzy.WebApp.SignalR
{
    public class QuizHub : Hub<IQuizHub>
    {
        private DataQuery m_DataQuery;
        private ILogger<QuizHub> m_Logger;

        public QuizHub(DataQuery dataQuery, ILogger<QuizHub> logger)
        {
            m_DataQuery = dataQuery;
            m_Logger = logger;
        }

        public override async Task OnConnectedAsync()
        {            
            m_Logger.LogWarning($"Connected: {Context.ConnectionId} {Context.UserIdentifier}");

            await base.OnConnectedAsync();
        }
        
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            m_Logger.LogWarning($"Disconnected: {Context.ConnectionId} {Context.UserIdentifier} {exception?.ToString()}");
                        
            await base.OnDisconnectedAsync(exception);
        }

        public Task Join(Joiner joiner)
        {            
            m_Logger.LogInformation($"Joined: {joiner.ParticipantId} [{Context.ConnectionId} {Context.UserIdentifier}]");

            var participant = m_DataQuery.FetchSingle<Participant>(p => p.Id == joiner.ParticipantId, joiner.CompetitionCode).GetAwaiter().GetResult();

            if (participant == null)
            {
                // Send failure to client
                Clients.Caller.JoinFailed(new Error { ErrorMessage = "Could not find Participant" });
                return Task.CompletedTask;
            }
            
            // Add to Group by Quiz Code
            Groups.AddToGroupAsync(Context.ConnectionId, participant.CompId);

            // TODO: Record SignalR ConnectionId ? 

            // Send success to client
            return Clients.Caller.JoinConfirmed(new ParticipantList());

            // TODO: Broadcast participant list/state changed
        }

        //public Task AnswerQuestion(Answer answer)
        //{

        //}
    }
    
    public interface IQuizHub
    {
        Task JoinConfirmed(ParticipantList participants);
        Task JoinFailed(Error participant);
        Task ParticipantListChanged(ParticipantList participants);

        Task NewQuestion(Question question);
    }

    public class LiveParticipant
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool Connected { get; set; }
    }

    public class ParticipantList
    {        
        public List<LiveParticipant> Participants { get; set; }
    }

    public class Joiner
    {
        public string CompetitionCode { get; set; }
        public Guid ParticipantId { get; set;}
    }

    public class Error
    {
        public string ErrorMessage { get; set; }
    }

    public class Question
    {
        public string Q { get; set; }
        public string a1 { get; set; }
        public string a2 { get; set; }
        public string a3 { get; set; }
        public string a4 { get; set; }
        public int No { get; set; }
        public int Total { get; set; }
    }

    public class Answer
    {
        public string QuestionNo { get; set; }
        public int AnswerNo { get; set; }
    }
}
