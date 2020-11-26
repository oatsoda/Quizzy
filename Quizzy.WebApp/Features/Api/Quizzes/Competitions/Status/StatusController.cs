using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Quizzes.Competitions.Status
{
    [ApiController]
    [Route("api/quizzes/{quizId}/competitions/{code}/")]
    public class StatusController : ControllerBase
    {
        private readonly IMediator m_Mediator;

        public StatusController(IMediator mediator)
        {
            m_Mediator = mediator;
        }

        [HttpPost("open")]
        public async Task<IActionResult> Open([FromRoute]Open.Command command)
        {
            await m_Mediator.Send(command);
            return NoContent();
        }

        [HttpPost("start")]
        public async Task<IActionResult> Start([FromRoute]Start.Command command)
        {
            await m_Mediator.Send(command);
            return NoContent();
        }
    }
}
