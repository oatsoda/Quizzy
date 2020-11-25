using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Quizzy.WebApp.DomainInfrastructure;
using System;
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

            // Check quiz exists etc.  Send message to Caller to confirm? (or send message with error?)
            //Clients.Caller.

            // Add to Group by Quiz Code

            // Filter by quizCode
            return Clients.All.Joined(new Participant { Id = joiner.ParticipantId } );
        }
    }
    
    public interface IQuizHub
    {
        Task Joined(Participant participant);
    }

    public class Participant
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class Joiner
    {
        public Guid ParticipantId { get; set;}
    }
}
