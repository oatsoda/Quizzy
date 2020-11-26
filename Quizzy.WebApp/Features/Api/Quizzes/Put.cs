using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.Azure.Cosmos;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Quizzes
{
    public class Put
    {
        public class Command : IRequest<Result>
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string CreatorEmail { get; set; }
            public string CreatorName { get; set; }
            
            public List<Question> Questions { get; set; }

            public class Question
            {
                public string Q { get; set; }
                public string A1 { get; set; }
                public string A2 { get; set; }
                public string A3 { get; set; }
                public string A4 { get; set; }
                public int CorrectA { get; set; }
            }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(c => c.Name)
                    .NotEmpty();
                RuleFor(c => c.CreatorEmail)
                    .NotEmpty();
                RuleFor(c => c.CreatorName)
                    .NotEmpty();
                RuleFor(c => c.Questions)
                    .NotEmpty();
                // Child rules
            }
        }

        public class Result : Command
        {
        }

        public class Handler : IRequestHandler<Command, Result>
        {
            private readonly DataStore m_DataStore;
            private readonly IMapper m_Mapper;

            public Handler(DataStore dataStore, IMapper mapper)
            {
                m_DataStore = dataStore;
                m_Mapper = mapper;
            }

            public async Task<Result> Handle(Command command, CancellationToken cancellationToken)
            {
                var quiz = await m_DataStore.Fetch<Quiz>(command.Id.ToString(), Quiz.CreatePartitionKeyFromId(command.Id));

                quiz = m_Mapper.Map(command, quiz);

                quiz = await m_DataStore.Update(quiz, quiz.Id.ToString(), quiz.PartKey);
                
                return m_Mapper.Map<Result>(quiz);
            }
        }
    }
}