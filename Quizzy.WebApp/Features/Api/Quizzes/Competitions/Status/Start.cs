﻿using FluentValidation;
using MediatR;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.Errors;
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

            public Handler(DataStore dataStore)
            {
                m_DataStore = dataStore;
            }

            protected override async Task Handle(Command command, CancellationToken cancellationToken)
            {                                
                var competition = await m_DataStore.Fetch<Competition>(command.Code, command.Code);

                if (competition == null)
                    throw new ResourceNotFoundException("Competition", "Code", command.Code.ToString());  
                                
                if (competition.QuizId != command.QuizId)
                    throw new ResourceNotFoundException("Competition", "QuizId", command.QuizId.ToString());

                competition.Start();
                await m_DataStore.Update(competition, competition.Code, competition.Code);
            }
        }
    }
}
