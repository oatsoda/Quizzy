using Microsoft.Azure.Cosmos;
using System.Threading.Tasks;

namespace Quizzy.WebApp.DomainInfrastructure
{
    public class DataStore : CosmosData
    {
        public DataStore(CosmosClient cosmosClient) : base(cosmosClient) { }

        public async Task<T> Create<T>(T item, string partitionKey)
        {
            var response = await Container<T>().CreateItemAsync(item, new PartitionKey(partitionKey));
            return response.Resource;
        }
        
        public async Task<T> Upsert<T>(T item, string partitionKey)
        {
            var response = await Container<T>().UpsertItemAsync(item, new PartitionKey(partitionKey));
            return response.Resource;
        }
        
        public async Task<T> Update<T>(T item, string id, string partitionKey)
        {
            var response = await Container<T>().ReplaceItemAsync(item, id, new PartitionKey(partitionKey));
            return response.Resource;
        }
    }
}