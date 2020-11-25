using Microsoft.Azure.Cosmos;
using Quizzy.WebApp.Data.Entities;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Quizzy.WebApp.DomainInfrastructure
{
    public abstract class CosmosData
    {
        protected const string _DATABASE_NAME = "Quizzes";

        protected static ReadOnlyDictionary<Type, string> s_TypeContainers = new ReadOnlyDictionary<Type, string>(
            new Dictionary<Type, string>
            {
                { typeof(Quiz), "Quizzes" },
                { typeof(Competition), "Competitions" },
                { typeof(Participant), "Competitions" },
            }
            );

        protected readonly CosmosClient m_CosmosClient;

        protected CosmosData(CosmosClient cosmosClient)
        {
            m_CosmosClient = cosmosClient;
        }

        protected Container Container<T>()
        {
            return m_CosmosClient.GetDatabase(_DATABASE_NAME)
                .GetContainer(s_TypeContainers[typeof(T)]);
        }
    }
}