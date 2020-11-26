using Microsoft.Azure.Cosmos;
using System.Net;
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

        public async Task<T> Fetch<T>(string id, string partitionKey) where T : class
        {
            try
            {
                var response = await Container<T>().ReadItemAsync<T>(id, new PartitionKey(partitionKey));
                return response.Resource;
            } 
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }
        }
    }
}