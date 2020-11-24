using System.Threading;
using MediatR;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Quizzy.WebApp.Data.Entities;
using AutoMapper;

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
            private readonly CosmosClient m_CosmosClient;
            private readonly IMapper m_Mapper;

            public Handler(CosmosClient cosmosClient, IMapper mapper)
            {
                m_CosmosClient = cosmosClient;
                m_Mapper = mapper;
            }

            public async Task<Result> Handle(Query query, CancellationToken cancellationToken)
            {                
                var container = m_CosmosClient.GetDatabase("Quizzes").GetContainer("Quizzes");
                var response = await container.ReadItemAsync<Quiz>(query.Code, new PartitionKey(Quiz.CreatePartitionKeyFromId(query.Code)));

                return m_Mapper.Map<Result>(response.Resource);
            }
        }
    }
}