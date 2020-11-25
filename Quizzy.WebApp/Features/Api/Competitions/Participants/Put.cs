using AutoMapper;
using FluentValidation;
using MediatR;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.Errors;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Competitions.Participants
{
    public class Put
    {
        public class Command : IRequest<Result>
        {
            public string CompetitionCode { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(c => c.Name)
                    .NotEmpty();
                RuleFor(c => c.Email)
                    .NotEmpty()
                    .EmailAddress();
            }
        }

        public class Result : Command
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result>
        {
            private readonly DataStore m_DataStore;
            private readonly DataQuery m_DataQuery;
            private readonly IMapper m_Mapper;

            public Handler(DataStore dataStore, DataQuery dataQuery, IMapper mapper)
            {
                m_DataStore = dataStore;
                m_DataQuery = dataQuery;
                m_Mapper = mapper;
            }

            public async Task<Result> Handle(Command command, CancellationToken cancellationToken)
            {                
                // Validate Competition
                if (!await m_DataQuery.Exists<Competition>(c => c.Code == command.CompetitionCode, command.CompetitionCode))
                    throw new ResourceNotFoundException("Competition", "Code", command.CompetitionCode.ToString()); // TODO: Change to BadRequest

                // Fetch same participant if exists already (re-joining)
                var participant = await m_DataQuery.FetchSingle<Participant>(p => p.Email == command.Email, command.CompetitionCode);

                // TODO: Validate Status of Competition (can't join if already started and didn't already join)
                if (participant == null)
                    participant = new Participant(command.CompetitionCode, command.Email);

                participant = m_Mapper.Map(command, participant);

                participant = await m_DataStore.Upsert(participant, participant.CompId);

                return m_Mapper.Map<Result>(participant);
            }
        }
    }
}
