using AutoMapper;
using MediatR;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.Errors;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Competitions
{
    public class Get
    {
        public class Query : IRequest<Result>
        {
            public string Code { get; set; }
        }

        public class Result : Query
        {
            public CompetitionStatus Status { get; set; }
            public Guid QuizId { get; set; }

            public ResultQuiz Quiz { get; set; }

            public class ResultQuiz
            {
                public Guid Id { get; set; }
                public string Name { get; set; }
                public string CreatorEmail { get; set; }
                public string CreatorName { get; set; }
            }

            public enum CompetitionStatus
            {
                None,
                WaitingForParticipants,
                Started,
                Finished
            }
        }

        public class Handler : IRequestHandler<Query, Result>
        {
            private readonly DataQuery m_DataQuery;
            private readonly IMapper m_Mapper;

            public Handler(DataQuery quizFetcher, IMapper mapper)
            {
                m_DataQuery = quizFetcher;
                m_Mapper = mapper;
            }

            public async Task<Result> Handle(Query query, CancellationToken cancellationToken)
            {                
                var competition = await m_DataQuery.FetchSingle<Competition>(c => c.Code == query.Code, query.Code);

                if (competition == null)
                    throw new ResourceNotFoundException("Competition", nameof(Query.Code), query.Code.ToString());                
                
                var quiz = await m_DataQuery.FetchSingle<Quiz>(q => q.Id == competition.QuizId, Quiz.CreatePartitionKeyFromId(competition.QuizId));
                
                if (quiz == null)
                    throw new InvalidOperationException("Competition associted with unknown Quiz"); 

                var result = m_Mapper.Map<Result>(competition);
                result.Quiz = m_Mapper.Map<Result.ResultQuiz>(quiz);

                return result;
            }
        }
    }
}
