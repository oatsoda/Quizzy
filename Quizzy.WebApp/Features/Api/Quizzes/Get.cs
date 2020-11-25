using AutoMapper;
using MediatR;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.Errors;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Quizzes
{
    public class Get
    {
        public class Query : IRequest<Result>
        {
            public Guid Id { get; set; }
        }

        public class Result : Query
        {
            public string Name { get; set; }
            public string CreatorEmail { get; set; }
            public string CreatorName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result>
        {
            private readonly DataQuery m_DataQuery;
            private readonly IMapper m_Mapper;

            public Handler(DataQuery dataQuery, IMapper mapper)
            {
                m_DataQuery = dataQuery;
                m_Mapper = mapper;
            }

            public async Task<Result> Handle(Query query, CancellationToken cancellationToken)
            {                
                var quiz = await m_DataQuery.FetchSingle<Quiz>(q => q.Id == query.Id, Quiz.CreatePartitionKeyFromId(query.Id));

                if (quiz == null)
                    throw new ResourceNotFoundException("Quiz", nameof(Query.Id), query.Id.ToString());                

                return m_Mapper.Map<Result>(quiz);
            }
        }
    }
}