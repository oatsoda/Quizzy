using AutoMapper;
using MediatR;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.Errors;
using System;
using System.Collections.Generic;
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
            public ResultOutcome Outcome { get; set; }

            public class ResultQuiz
            {
                public Guid Id { get; set; }
                public string Name { get; set; }
                public string CreatorEmail { get; set; }
                public string CreatorName { get; set; }
            }

            public class ResultOutcome
            {
                public ResultOutcomeLeader First { get; set; }
                public ResultOutcomeLeader Second { get; set; }
                public ResultOutcomeLeader Third { get; set; }
                public int TotalQuestions { get; set; }
            }

            public class ResultOutcomeLeader
            {
                public string Name { get; set; }
                public int CorrectAnswers { get; set; }
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

                if (competition.Status == CompetitionStatus.Finished)
                {
                    // TODO: How to solve tie-breakers / same scores?
                    var topParticipants = await GetTopParticipants(competition.Code);

                    result.Outcome = new Result.ResultOutcome
                    {
                        TotalQuestions = quiz.Questions.Count,
                        First = topParticipants.Count > 0 ? m_Mapper.Map<Result.ResultOutcomeLeader>(topParticipants[0]) : null,
                        Second = topParticipants.Count > 1 ? m_Mapper.Map<Result.ResultOutcomeLeader>(topParticipants[1]) : null,
                        Third = topParticipants.Count > 2 ? m_Mapper.Map<Result.ResultOutcomeLeader>(topParticipants[2]) : null                       
                    };
                }

                return result;
            }

            private async Task<List<Participant>> GetTopParticipants(string competitionCode)
            {
                return await m_DataQuery.FetchLimited<Participant, int>(p => p.Discriminator == "Participant" && p.CompId == competitionCode, p => p.CorrectAnswers, competitionCode, 3);
            }
        }
    }
}
