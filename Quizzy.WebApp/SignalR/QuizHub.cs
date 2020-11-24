using Microsoft.AspNetCore.SignalR;
using Quizzy.WebApp.Features.Api.Quizzes;
using System.Threading.Tasks;

namespace Quizzy.WebApp.SignalR
{
    public class QuizHub : Hub
    {
        private QuizFetcher m_QuizFetcher;

        public QuizHub(QuizFetcher quizFetcher)
        {
            m_QuizFetcher = quizFetcher;
        }

        public async Task Joining(string participantName, string participantEmail, string quizCode)
        {
            // Check quiz exists etc.  Send message to Caller to confirm? (or send message with error?)
            //Clients.Caller.

            // Add to Group by Quiz Code

            // Filter by quizCode
            await Clients.All.SendAsync("Joined", participantName);
        }
    }
}
