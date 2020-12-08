using Microsoft.AspNetCore.Builder;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Fluent;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Quizzy.WebApp.DomainInfrastructure
{
    public static class CosmosDbStartupExtensions
    {
        public const string QUIZZES_DB_NAME = "Quizzes";
        public const string QUIZZES_CONTAINER_NAME = "Quizzes";
        public const string COMPS_CONTAINER_NAME = "Competitions";

        public static IServiceCollection AddCosmosDb(this IServiceCollection serviceCollection, IConfiguration configuration)
        {
            var connString = configuration.GetConnectionString("CosmosQuizDb");
            var cosmosClientBuilder = new CosmosClientBuilder(connString) // TODO: Upgrade to v4 once released and change to enums as strings.
                .AddCustomHandlers(new CosmosRequestHandler());
            serviceCollection.AddSingleton(cosmosClientBuilder.Build());

            return serviceCollection;
        }

        public static void ConfigureCosmosDbDevelopmentEnvironment(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();

            var cosmosClient = scope.ServiceProvider.GetService<CosmosClient>();

            var database = cosmosClient.CreateDatabaseIfNotExistsAsync(QUIZZES_DB_NAME, 400).GetAwaiter().GetResult();

            database.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(QUIZZES_CONTAINER_NAME, "/PartKey"));
            database.Database.CreateContainerIfNotExistsAsync(new ContainerProperties(COMPS_CONTAINER_NAME, "/CompId"));


        }
    }

    public class CosmosRequestHandler : RequestHandler
    {
        public override async Task<ResponseMessage> SendAsync(RequestMessage request, CancellationToken cancellationToken) 
        {
#if DEBUG
            if (request.Content != null)
            {
                using var ms = new MemoryStream();
                request.Content.CopyTo(ms);
                var q = Encoding.UTF8.GetString(ms.ToArray());
                Console.WriteLine($"{request.Method} {request.RequestUri} : {q}");
            }
            else
            {
                Console.WriteLine($"{request.Method} {request.RequestUri} : null");
            }
#endif
            var response = await base.SendAsync(request, cancellationToken);
            Console.WriteLine($"{response.Headers.RequestCharge} RUs");

            return response;
        }
    }
}
