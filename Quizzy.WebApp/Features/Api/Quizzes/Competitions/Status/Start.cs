using FluentValidation;
using MediatR;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.Errors;
using Quizzy.WebApp.QuizProcess;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Quizzes.Competitions
{
    public class Start
    {
        public class Command : IRequest
        {
            public Guid QuizId { get; set; }
            public string Code { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
            }
        }

        public class Handler : AsyncRequestHandler<Command>
        {
            private readonly DataStore m_DataStore;
            private readonly LiveQuizzes m_LiveQuizzes;
            private readonly DataQuery m_DataQuery;

            public Handler(DataStore dataStore, LiveQuizzes liveQuizzes, DataQuery dataQuery)
            {
                m_DataStore = dataStore;
                m_LiveQuizzes = liveQuizzes;
                m_DataQuery = dataQuery;
            }

            protected override async Task Handle(Command command, CancellationToken cancellationToken)
            {                                
                var competition = await m_DataStore.Fetch<Competition>(command.Code, command.Code);

                if (competition == null)
                    throw new ResourceNotFoundException("Competition", "Code", command.Code.ToString());  
                                
                if (competition.QuizId != command.QuizId)
                    throw new ResourceNotFoundException("Competition", "QuizId", command.QuizId.ToString());

                var participants = await m_DataQuery.Count<Participant>(p => p.CompId == competition.Code && p.Discriminator == Participant.DiscriminatorValue, competition.Code);
                if (participants == 0)
                    throw new BadRequestException("Code", "The competition hasn't got any participants yet. You cannot start it until participants have registered");

                competition.Start();
                await m_DataStore.Update(competition, competition.Code, competition.Code);

                await m_LiveQuizzes.StartQuiz(competition);
            }
        }
    }
}
