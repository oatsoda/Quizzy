using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using System;
using System.Collections.Generic;
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

            var feedIterator = container.GetItemLinqQueryable<T>(requestOptions: new QueryRequestOptions { PartitionKey = partitionKey == null ? null : new PartitionKey(partitionKey), MaxItemCount = 2 })
                .Where(filter)
                .ToFeedIterator();

            if (!feedIterator.HasMoreResults)
                return null;

            var results = await feedIterator.ReadNextAsync();
            return results.SingleOrDefault();
        }

        public async Task<bool> Exists<T>(Expression<Func<T, bool>> filter, string partitionKey) where T : class
        {            
            return await Count(filter, partitionKey) > 0;
        }
        
        public async Task<int> Count<T>(Expression<Func<T, bool>> filter, string partitionKey) where T : class
        {
            var container = m_CosmosClient.GetDatabase(_DATABASE_NAME)
                                          .GetContainer(s_TypeContainers[typeof(T)]);

            var count = await container.GetItemLinqQueryable<T>(requestOptions: new QueryRequestOptions { PartitionKey = new PartitionKey(partitionKey) })
                .Where(filter)
                .CountAsync();

            return count.Resource;
        }
        
        public async Task<TValue> FetchSingle<TContainer, TValue>(QueryDefinition queryDefinition, string partitionKey)
        {
            var container = m_CosmosClient.GetDatabase(_DATABASE_NAME)
                                          .GetContainer(s_TypeContainers[typeof(TContainer)]);

            using var feedIterator = container.GetItemQueryIterator<TValue>(queryDefinition, requestOptions: new QueryRequestOptions { PartitionKey = new PartitionKey(partitionKey), MaxItemCount = 1 });

            if (!feedIterator.HasMoreResults)
                return default;

            var results = await feedIterator.ReadNextAsync();
            return results.SingleOrDefault();
        }
        
        public async Task<List<TValue>> FetchAll<TContainer, TValue>(QueryDefinition queryDefinition, string partitionKey)
        {
            var container = m_CosmosClient.GetDatabase(_DATABASE_NAME)
                                          .GetContainer(s_TypeContainers[typeof(TContainer)]);

            using var feedIterator = container.GetItemQueryIterator<TValue>(queryDefinition, requestOptions: new QueryRequestOptions { PartitionKey = new PartitionKey(partitionKey), MaxItemCount = 1 });

            var results = new List<TValue>();
            while (feedIterator.HasMoreResults)
            {
                var r = await feedIterator.ReadNextAsync();
                results.AddRange(r);
            }

            return results;
        }

        private IOrderedQueryable<T> GetQueryable<T>(string partitionKey, int itemsPerPage = 20) where T : class
        {
            var container = m_CosmosClient.GetDatabase(_DATABASE_NAME)
                                          .GetContainer(s_TypeContainers[typeof(T)]);

            return container.GetItemLinqQueryable<T>(requestOptions: new QueryRequestOptions { PartitionKey = new PartitionKey(partitionKey), MaxItemCount = itemsPerPage });            
        }
    }
}