using Microsoft.Azure.Cosmos;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Quizzes
{
    public class DataStore : CosmosData
    {
        public DataStore(CosmosClient cosmosClient) : base(cosmosClient) { }

        public async Task<T> Create<T>(T item, string partitionKey)
        {
            var container = m_CosmosClient.GetDatabase(_DATABASE_NAME)
                                          .GetContainer(s_TypeContainers[typeof(T)]);

            var response = await container.CreateItemAsync(item, new PartitionKey(partitionKey));
            return response.Resource;
        }
    }
}