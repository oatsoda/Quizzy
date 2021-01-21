using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.ComponentModel;

namespace Quizzy.WebApp.Features.Api.Quizzes.Competitions
{
    [ApiController]
    [Route("api/quizzes/{quizId}/[controller]")]
    [DisplayName("Manage Quizzes > Competition")]
    public class CompetitionsController : ControllerBase
    {
        private readonly IMediator m_Mediator;

        public CompetitionsController(IMediator mediator)
        {
            m_Mediator = mediator;
        }
        
        /// <summary>
        /// Gets a Competition for a Quiz.
        /// </summary>
        [HttpGet("{code}")]
        public async Task<IActionResult> Get([FromRoute]Get.Query query)
        {
            var result = await m_Mediator.Send(query);
            return Ok(result);
        }
                
        /// <summary>
        /// Creates a new Competition for a Quiz.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Post([FromRoute]Guid quizId, Post.Command command)
        {
            command.QuizId = quizId;
            var result = await m_Mediator.Send(command);
            return CreatedAtAction(nameof(Get), new { quizId = quizId, code = result.Code }, result);
        }
    }
}
