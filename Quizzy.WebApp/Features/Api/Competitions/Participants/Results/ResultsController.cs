using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Competitions.Participants.Results
{
    [ApiController]
    [Route("api/competitions/{code}/participants/{participantId}/[controller]")]
    public class ResultsController : ControllerBase
    {
        private readonly IMediator m_Mediator;

        public ResultsController(IMediator mediator)
        {
            m_Mediator = mediator;
        }
                
        [HttpGet]
        public async Task<IActionResult> Get([FromRoute]Get.Query query)
        {
            var result = await m_Mediator.Send(query);
            return Ok(result);
        }
    }


}
