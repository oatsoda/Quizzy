using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Competitions
{
    [ApiController]
    [Route("api/[controller]")]
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
    }
}
