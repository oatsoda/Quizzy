using Microsoft.Azure.Cosmos;
using Quizzy.WebApp.Data.Entities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Quizzy.WebApp.Features.Api.Quizzes
{
    public abstract class CosmosData
    {
        protected const string _DATABASE_NAME = "Quizzes";

        protected static ReadOnlyDictionary<Type, string> s_TypeContainers = new ReadOnlyDictionary<Type, string>(
            new Dictionary<Type, string>
            {
                { typeof(Quiz), "Quizzes" },
                { typeof(Competition), "Competitions" },
            }
            );

        protected readonly CosmosClient m_CosmosClient;

        protected CosmosData(CosmosClient cosmosClient)
        {
            m_CosmosClient = cosmosClient;
        }
    }
}