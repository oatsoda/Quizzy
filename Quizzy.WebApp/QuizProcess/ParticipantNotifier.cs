using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Quizzy.WebApp.QuizProcess
{
    public class ParticipantNotifier
    {
        private readonly IHubContext<HubMessages, IClientMessages> m_HubContext;

        public ParticipantNotifier(IHubContext<HubMessages, IClientMessages> hubContext)
        {
            m_HubContext = hubContext;
        }

        public Task NotifyStarted(string code, Question firstQuestion)
        {
            return m_HubContext.Clients.Group(code).Started(firstQuestion);
        }

        public Task NotifyNextQuestion(string code, Question question)
        {
            return m_HubContext.Clients.Group(code).NewQuestion(question);
        }

        public Task NotifyFinished(string code)
        {
            return m_HubContext.Clients.Group(code).Finished();
        }

        public Task NotifyParticipantsChanged(string code, ParticipantList participants, string excludeClientId = null)
        {
            var target = excludeClientId == null
                ? m_HubContext.Clients.Group(code)
                : m_HubContext.Clients.GroupExcept(code, new[] { excludeClientId });
            return target.ParticipantsChanged(participants);
        }
    }
}
