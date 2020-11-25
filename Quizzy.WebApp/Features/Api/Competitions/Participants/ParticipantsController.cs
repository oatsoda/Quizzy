using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Competitions.Participants
{
    [ApiController]
    [Route("api/competitions/{code}/[controller]")]
    public class ParticipantsController : ControllerBase
    {
        private readonly IMediator m_Mediator;

        public ParticipantsController(IMediator mediator)
        {
            m_Mediator = mediator;
        }
                
        [HttpPut]
        public async Task<IActionResult> Put([FromRoute]string code, Put.Command command)
        {
            command.CompetitionCode = code;
            var result = await m_Mediator.Send(command);
            return Ok(result);
        }
    }


}
