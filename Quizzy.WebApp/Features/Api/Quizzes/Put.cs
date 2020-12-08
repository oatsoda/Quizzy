using AutoMapper;
using FluentValidation;
using MediatR;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.DomainServices;
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
                RuleFor(c => c.Questions)
                    .NotEmpty();
                RuleForEach(c => c.Questions)
                    .SetValidator(new QuestionValidator())
                    .When(c => c.Questions != null);
            }
        }

        public class QuestionValidator : AbstractValidator<Command.Question> 
        {
            public QuestionValidator()
            {
                RuleFor(q => q.Q)
                    .NotEmpty();                
                RuleFor(q => q.A1)
                    .NotEmpty()
                    ;// TODO: Check unique answers e.g. .Must((q, a1) => a1 != q.A2 ...).WithMessage(...);                
                RuleFor(q => q.A2)
                    .NotEmpty();                
                RuleFor(q => q.A3)
                    .NotEmpty();                
                RuleFor(q => q.A4)
                    .NotEmpty();                
                RuleFor(q => q.CorrectA)
                    .InclusiveBetween(1, 4);
            }
        }

        public class Result : Command
        {
        }

        public class Handler : IRequestHandler<Command, Result>
        {
            private readonly DataStore m_DataStore;
            private readonly IMapper m_Mapper;
            private readonly UnfinishedCompetitionChecker m_UnfinishedCompetitionChecker;

            public Handler(DataStore dataStore, IMapper mapper, UnfinishedCompetitionChecker unfinishedCompetitionChecker)
            {
                m_DataStore = dataStore;
                m_Mapper = mapper;
                m_UnfinishedCompetitionChecker = unfinishedCompetitionChecker;
            }

            public async Task<Result> Handle(Command command, CancellationToken cancellationToken)
            {
                var quiz = await m_DataStore.Fetch<Quiz>(command.Id.ToString(), Quiz.CreatePartitionKeyFromId(command.Id));

                await m_UnfinishedCompetitionChecker.CheckForUnfinishedCompetitions(command.Id);

                quiz = m_Mapper.Map(command, quiz);

                quiz = await m_DataStore.Update(quiz, quiz.Id.ToString(), quiz.PartKey);
                
                return m_Mapper.Map<Result>(quiz);
            }
        }
    }
}