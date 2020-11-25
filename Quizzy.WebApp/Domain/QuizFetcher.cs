using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Quizzy.WebApp.Data.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Quizzes
{
    public class QuizFetcher
    {
        private readonly CosmosClient m_CosmosClient;

        public QuizFetcher(CosmosClient cosmosClient)
        {
            m_CosmosClient = cosmosClient;
        }

        public async Task<Quiz> FetchQuiz(Guid quizId)
        {
            var container = m_CosmosClient.GetDatabase("Quizzes").GetContainer("Quizzes");
                
            var feedIterator = container.GetItemLinqQueryable<Quiz>(requestOptions: new QueryRequestOptions { PartitionKey = new PartitionKey(Quiz.CreatePartitionKeyFromId(quizId)), MaxItemCount = 1 })
                .Where(q => q.Id == quizId)
                .ToFeedIterator();

            if (!feedIterator.HasMoreResults)
                return null;
            
            var results = await feedIterator.ReadNextAsync();
            return results.SingleOrDefault();            
        }
    }
}