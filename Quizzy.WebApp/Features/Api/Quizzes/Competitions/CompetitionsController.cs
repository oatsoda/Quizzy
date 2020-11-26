using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Quizzes.Competitions
{
    [ApiController]
    [Route("api/quizzes/{quizId}/[controller]")]
    public class CompetitionsController : ControllerBase
    {
        private readonly IMediator m_Mediator;

        public CompetitionsController(IMediator mediator)
        {
            m_Mediator = mediator;
        }

        [HttpGet("{code}")]
        public async Task<IActionResult> Get([FromRoute]Get.Query query)
        {
            var result = await m_Mediator.Send(query);
            return Ok(result);
        }
        
        [HttpPost]
        public async Task<IActionResult> Post([FromRoute]Guid quizId, Put.Command command)
        {
            command.QuizId = quizId;
            var result = await m_Mediator.Send(command);
            return CreatedAtAction(nameof(Get), new { quizId = quizId, code = result.Code }, result);
        }
    }
}
