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
            public string Code { get; set; }
        }

        public class Result : Query
        {
            public Guid QuizId { get; set; }
            public CompetitionStatus Status { get; set; }

            public enum CompetitionStatus
            {
                None,
                WaitingForParticipants,
                Started,
                Finished
            }
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
                // TODO: Include QuizId in query?
                var competition = await m_DataQuery.FetchSingle<Competition>(c => c.Code == query.Code, query.Code);

                if (competition == null)
                    throw new ResourceNotFoundException("Competition", nameof(Query.Code), query.Code.ToString());                
                
                return m_Mapper.Map<Result>(competition);
            }
        }
    }
}
