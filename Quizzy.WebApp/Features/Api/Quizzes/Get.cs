using System.Threading;
using MediatR;
using System.Threading.Tasks;
using AutoMapper;
using Quizzy.WebApp.Errors;

namespace Quizzy.WebApp.Features.Api.Quizzes
{
    public class Get
    {
        public class Query : IRequest<Result>
        {
            public string Code { get; set; }
        }

        public class Result : Query
        {
            public string Name { get; set; }
            public string CreatorEmail { get; set; }
            public string CreatorName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result>
        {
            private readonly QuizFetcher m_QuizFetcher;
            private readonly IMapper m_Mapper;

            public Handler(QuizFetcher quizFetcher, IMapper mapper)
            {
                m_QuizFetcher = quizFetcher;
                m_Mapper = mapper;
            }

            public async Task<Result> Handle(Query query, CancellationToken cancellationToken)
            {                
                var quiz = await m_QuizFetcher.FetchQuiz(query.Code);

                if (quiz == null)
                    throw new ResourceNotFoundException("Quiz", nameof(Query.Code), query.Code);                

                return m_Mapper.Map<Result>(quiz);
            }
        }
    }
}