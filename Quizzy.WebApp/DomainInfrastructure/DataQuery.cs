using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Quizzy.WebApp.DomainInfrastructure
{
    public class DataQuery : CosmosData
    {
        public DataQuery(CosmosClient cosmosClient) : base(cosmosClient) { }

        public async Task<T> FetchSingle<T>(Expression<Func<T, bool>> filter, string partitionKey) where T : class
        {
            var container = m_CosmosClient.GetDatabase(_DATABASE_NAME)
                                          .GetContainer(s_TypeContainers[typeof(T)]);

            var feedIterator = container.GetItemLinqQueryable<T>(requestOptions: new QueryRequestOptions { PartitionKey = new PartitionKey(partitionKey), MaxItemCount = 1 })
                .Where(filter)
                .ToFeedIterator();

            if (!feedIterator.HasMoreResults)
                return null;

            var results = await feedIterator.ReadNextAsync();
            return results.SingleOrDefault();
        }

        public async Task<bool> Exists<T>(Expression<Func<T, bool>> filter, string partitionKey) where T : class
        {
            var container = m_CosmosClient.GetDatabase(_DATABASE_NAME)
                                          .GetContainer(s_TypeContainers[typeof(T)]);

            var count = await container.GetItemLinqQueryable<T>(requestOptions: new QueryRequestOptions { PartitionKey = new PartitionKey(partitionKey), MaxItemCount = 1 })
                .Where(filter)
                .CountAsync();

            return count.Resource > 0;
        }
    }
}