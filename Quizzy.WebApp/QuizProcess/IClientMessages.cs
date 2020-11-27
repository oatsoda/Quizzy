using System.Threading.Tasks;

namespace Quizzy.WebApp.QuizProcess
{
    /// <summary>
    /// Messages that can be sent To Client.
    /// </summary>
    public interface IClientMessages
    {
        // Used only by the HubMessages Join
        Task JoinConfirmed(JoinConfirmed joinConfirmed);
        Task JoinFailed(Error participant);

        // Actual "events" triggered
        Task ParticipantsChanged(ParticipantList participants);
        Task Started(Question question);
        Task NewQuestion(Question question);
        Task Finished();
    }

}
