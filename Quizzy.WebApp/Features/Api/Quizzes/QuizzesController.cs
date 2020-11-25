using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Quizzes
{
    [ApiController]
    [Route("api/[controller]/")]
    public class QuizzesController : ControllerBase
    {
        private readonly IMediator m_Mediator;

        public QuizzesController(IMediator mediator)
        {
            m_Mediator = mediator;
        }

        [HttpGet("{Id}")]
        public async Task<IActionResult> Get([FromRoute]Get.Query query)
        {
            var result = await m_Mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post(Post.Command command)
        {
            var result = await m_Mediator.Send(command);
            return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
        }
    }
}