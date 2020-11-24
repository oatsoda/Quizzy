using System.Threading;
using MediatR;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Quizzy.WebApp.Data.Entities;
using AutoMapper;
using Quizzy.WebApp.Errors;
using System.Linq;
using Microsoft.Azure.Cosmos.Linq;

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
                
                var feedIterator = container.GetItemLinqQueryable<Quiz>(requestOptions: new QueryRequestOptions { PartitionKey = new PartitionKey(Quiz.CreatePartitionKeyFromId(query.Code)), MaxItemCount = 1 })
                    .Where(q => q.Id == query.Code)
                    .ToFeedIterator();

                Quiz quiz = null;
                if (feedIterator.HasMoreResults)
                {
                    var results = await feedIterator.ReadNextAsync();
                    quiz = results.SingleOrDefault();
                }

                if (quiz == null)
                    throw new ResourceNotFoundException("Quiz", nameof(Query.Code), query.Code);                

                //ItemResponse<Quiz> response;
                //try 
                //{
                //    response = await container.ReadItemAsync<Quiz>(query.Code, new PartitionKey(Quiz.CreatePartitionKeyFromId(query.Code)));
                //} 
                //catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
                //{
                //    throw new ResourceNotFoundException("Quiz", nameof(Query.Code), query.Code);
                //}

                return m_Mapper.Map<Result>(quiz);//lresponse.Resource);
            }
        }
    }
}