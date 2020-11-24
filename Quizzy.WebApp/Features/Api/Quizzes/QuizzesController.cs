using System.Threading;
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

        [HttpGet("{code}")]
        public async Task<IActionResult> Get(string code)
        {
            var result = await m_Mediator.Send(new Get.Query { Code = code });
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Post(Post.Command command)
        {
            return NotFound();
        }
    }

    public class Get
    {
        public class Query : IRequest<Result>
        {
            public string Code { get; set; }
        }

        public class Result : Query
        {
            public string Name { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result>
        {
            public Task<Result> Handle(Query query, CancellationToken cancellationToken)
            {
                return Task.FromResult(new Result { Code = query.Code, Name = "test" });
            }
        }
    }

    public class Post
    {
        public class Command
        {

        }
    }
}