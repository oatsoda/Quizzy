using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.Azure.Cosmos;
using Quizzy.WebApp.Data.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Quizzes
{
    public class Post
    {
        public class Command : IRequest<Result>
        {
            public string Name { get; set; }
            public string CreatorEmail { get; set; }
            public string CreatorName { get; set; }
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
            }
        }

        public class Result : Command
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result>
        {
            private readonly CosmosClient m_CosmosClient;
            private readonly IMapper m_Mapper;

            public Handler(CosmosClient cosmosClient, IMapper mapper)
            {
                m_CosmosClient = cosmosClient;
                m_Mapper = mapper;
            }

            public async Task<Result> Handle(Command command, CancellationToken cancellationToken)
            {
                var quiz = new Quiz(command.Name, command.CreatorEmail);
                quiz = m_Mapper.Map(command, quiz);

                var container = m_CosmosClient.GetDatabase("Quizzes").GetContainer("Quizzes");
                var response = await container.CreateItemAsync(quiz, new PartitionKey(quiz.PartKey));
                
                return m_Mapper.Map<Result>(response.Resource);
            }
        }
    }
}