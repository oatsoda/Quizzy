using AutoMapper;
using FluentValidation;
using MediatR;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.DomainServices;
using Quizzy.WebApp.Errors;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Quizzes.Competitions
{
    public class Put
    {
        public class Command : IRequest<Result>
        {
            public Guid QuizId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
            }
        }

        public class Result : Command
        {
            public string Code { get; set; }
            public CompetitionStatus Status { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result>
        {
            private readonly DataStore m_DataStore;
            private readonly DataQuery m_DataQuery;
            private readonly IMapper m_Mapper;
            private readonly CompetitionCodeGenerator m_CompetitionCodeGenerator;

            public Handler(DataStore dataStore, DataQuery dataQuery, IMapper mapper, CompetitionCodeGenerator competitionCodeGenerator)
            {
                m_DataStore = dataStore;
                m_DataQuery = dataQuery;
                m_Mapper = mapper;
                m_CompetitionCodeGenerator = competitionCodeGenerator;
            }

            public async Task<Result> Handle(Command command, CancellationToken cancellationToken)
            {
                // Validate QuizId
                if (!await m_DataQuery.Exists<Quiz>(q => q.Id == command.QuizId, Quiz.CreatePartitionKeyFromId(command.QuizId)))
                    throw new ResourceNotFoundException("Quiz", "Id", command.QuizId.ToString());

                var competition = await Task.Run(() => new Competition(command.QuizId, m_CompetitionCodeGenerator));
                competition = m_Mapper.Map(command, competition);

                competition = await m_DataStore.Create(competition, competition.CompId);

                return m_Mapper.Map<Result>(competition);
            }
        }
    }
}
