using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizzy.WebApp.QuizProcess
{
    public class QuizHub : Hub<IQuizHub>
    {
        private DataQuery m_DataQuery;
        private readonly LiveQuizzes m_LiveQuizzes;
        private ILogger<QuizHub> m_Logger;

        public QuizHub(DataQuery dataQuery, LiveQuizzes liveQuizzes, ILogger<QuizHub> logger)
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

            //var competition = m_DataQuery.FetchSingle<Competition>(c => c.Code == participant.CompId, participant.CompId).GetAwaiter().GetResult();

            var response = m_LiveQuizzes.JoinQuiz(joiner.CompetitionCode, participant, Context.ConnectionId).GetAwaiter().GetResult();

            // Send success to client
            return Clients.Caller.JoinConfirmed(response);

            // TODO: Broadcast participant list/state changed
        }

        public Task AnswerQuestion(Answer answer)
        {
            return m_LiveQuizzes.AnswerQuestion(answer);
        }
    }
    
    public interface IQuizHub
    {
        Task JoinConfirmed(JoinConfirmed joinConfirmed);
        Task JoinFailed(Error participant);

        Task ParticipantListChanged(ParticipantList participants);

        Task Started(Question question);
        Task NewQuestion(Question question);
        Task Finished();
    }

    public class LiveParticipant
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        //public bool Connected { get; set; }
    }

    public class ParticipantList
    {        
        public List<LiveParticipant> Participants { get; set; }
    }

    public class Joiner
    {
        public string CompetitionCode { get; set; }
        public Guid ParticipantId { get; set; }
    }

    public class JoinConfirmed
    {
        public ParticipantList Participants { get; set; }
        public Question Question { get; set; }
    }

    public class Error
    {
        public string ErrorMessage { get; set; }
    }


    public class Answer
    {
        public string CompetitionCode { get; set; }
        public Guid ParticipantId { get; set; }
        public int QuestionNo { get; set; }
        public int AnswerNo { get; set; }
    }


    public class Question
    {
        public string Q { get; set; }
        public string A1 { get; set; }
        public string A2 { get; set; }
        public string A3 { get; set; }
        public string A4 { get; set; }
        public int No { get; set; }
        public int Total { get; set; }
    }

    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<QuizQuestion, Question>();
        }
    }

}
