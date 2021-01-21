using AutoMapper;
using MediatR;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.DomainServices;
using Quizzy.WebApp.Errors;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Quizzes
{
    public class Get
    {
        public class Query : IRequest<Result>
        {
            /// <summary>
            /// The unique identifier for the Quiz.
            /// </summary>
            public Guid Id { get; set; }
        }

        public class Result : Query
        {
            public string Name { get; set; }
            public string CreatorEmail { get; set; }
            public string CreatorName { get; set; }

            public List<Question> Questions { get; set; }

            public CompetitionInformation CompetitionInfo { get; set; }

            public class Question
            {
                public string Q { get; set; }
                public string A1 { get; set; }
                public string A2 { get; set; }
                public string A3 { get; set; }
                public string A4 { get; set; }
                public int CorrectA { get; set; }
            }

            public class CompetitionInformation
            {
                public bool UnfinishedCompetitionExists { get; set; }
                public string UnfinishedCompetitionCode { get; set; }
            }
        }

        public class Handler : IRequestHandler<Query, Result>
        {
            private readonly DataQuery m_DataQuery;
            private readonly IMapper m_Mapper;
            private readonly UnfinishedCompetitionChecker m_UnfinishedCompetitionChecker;

            public Handler(DataQuery dataQuery, IMapper mapper, UnfinishedCompetitionChecker unfinishedCompetitionChecker)
            {
                m_DataQuery = dataQuery;
                m_Mapper = mapper;
                m_UnfinishedCompetitionChecker = unfinishedCompetitionChecker;
            }

            public async Task<Result> Handle(Query query, CancellationToken cancellationToken)
            {                
                var quiz = await m_DataQuery.FetchSingle<Quiz>(q => q.Id == query.Id, Quiz.CreatePartitionKeyFromId(query.Id));

                if (quiz == null)
                    throw new ResourceNotFoundException("Quiz", nameof(Query.Id), query.Id.ToString());                

                var result = m_Mapper.Map<Result>(quiz);

                var unfinishedCompetitionCode = await m_UnfinishedCompetitionChecker.CheckForUnfinishedCompetitions(quiz.Id, false);
                result.CompetitionInfo = new Result.CompetitionInformation 
                    { 
                        UnfinishedCompetitionExists = unfinishedCompetitionCode != null,
                        UnfinishedCompetitionCode = unfinishedCompetitionCode
                    };

                return result;
            }
        }
    }
}