using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using System;
using System.Threading.Tasks;

namespace Quizzy.WebApp.QuizProcess
{
    public class HubMessages : Hub<IClientMessages>
    {
        private DataQuery m_DataQuery;
        private readonly LiveQuizzes m_LiveQuizzes;
        private ILogger<HubMessages> m_Logger;

        public HubMessages(DataQuery dataQuery, LiveQuizzes liveQuizzes, ILogger<HubMessages> logger)
        {
            m_DataQuery = dataQuery;
            m_LiveQuizzes = liveQuizzes;
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
                        
            // TODO: Cross partition query
            
            var participant = await m_DataQuery.FetchSingle<Participant>(p => p.ClientId == Context.ConnectionId, null);
            if (participant != null)
                await m_LiveQuizzes.LeftQuiz(participant.CompId, participant);

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

            var response = m_LiveQuizzes.JoinQuiz(joiner.CompetitionCode, participant, Context.ConnectionId).GetAwaiter().GetResult();

            // Send success to client
            return Clients.Caller.JoinConfirmed(response);
        }

        public Task AnswerQuestion(Answer answer)
        {
            return m_LiveQuizzes.AnswerQuestion(answer);
        }
    }

}
