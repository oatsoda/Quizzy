using AutoMapper;
using MediatR;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.Errors;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Quizzes.Competitions
{
    public class Get
    {
        public class Query : IRequest<Result>
        {
            public Guid QuizId { get; set; }
            public string Code { get; set; }
        }

        public class Result : Query
        {
            public CompetitionStatus Status { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result>
        {
            private readonly DataQuery m_DataQuery;
            private readonly IMapper m_Mapper;

            public Handler(DataQuery quizFetcher, IMapper mapper)
            {
                m_DataQuery = quizFetcher;
                m_Mapper = mapper;
            }

            public async Task<Result> Handle(Query query, CancellationToken cancellationToken)
            {                
                var competition = await m_DataQuery.FetchSingle<Competition>(c => c.Code == query.Code, query.Code);

                if (competition == null)
                    throw new ResourceNotFoundException("Competition", nameof(Query.Code), query.Code.ToString());
                                
                if (competition.QuizId != query.QuizId)
                    throw new ResourceNotFoundException("Competition", "QuizId", query.QuizId.ToString());

                return m_Mapper.Map<Result>(competition);
            }
        }
    }
}
