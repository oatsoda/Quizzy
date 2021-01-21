using AutoMapper;
using MediatR;
using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.Errors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Quizzy.WebApp.Features.Api.Competitions.Participants.Results
{
    public class Get
    {
        public class Query : IRequest<Result>
        {
            /// <summary>
            /// The unique code for the Competition.
            /// </summary>
            public string Code { get; set; }
            
            /// <summary>
            /// The unique identifier for the Participant of the Competition.
            /// </summary>
            public Guid ParticipantId { get; set; }
        }

        public class Result : Query
        {
            public Guid QuizId { get; set; }
            public string Name { get; set; }
            public string CreatorEmail { get; set; }
            public string CreatorName { get; set; }
            public string ParticipantEmail { get; set; }
            public string ParticipantName { get; set; }
            
            public int TotalQuestions { get; set; }
            public int TotalCorrect { get; set; }

            public List<Question> Questions { get; set; }

            public class Question
            {
                public string Q { get; set; }
                public string A1 { get; set; }
                public string A2 { get; set; }
                public string A3 { get; set; }
                public string A4 { get; set; }
                public int CorrectA { get; set; }
                public int? ParticipantA { get; set; }
                public bool IsCorrect { get; set; }
            }
        }

        public class Handler : IRequestHandler<Query, Result>
        {
            private readonly DataQuery m_DataQuery;
            private readonly IMapper m_Mapper;

            public Handler(DataQuery dataQuery, IMapper mapper)
            {
                m_DataQuery = dataQuery;
                m_Mapper = mapper;
            }

            public async Task<Result> Handle(Query query, CancellationToken cancellationToken)
            {                
                // Competition
                var competition = await m_DataQuery.FetchSingle<Competition>(c => c.Code == query.Code, query.Code);
                if (competition == null)
                    throw new ResourceNotFoundException("Competition", "Code", query.Code);
                
                // Participant
                var participant = await m_DataQuery.FetchSingle<Participant>(p => p.Id == query.ParticipantId, query.Code);
                if (participant == null || participant.CompId != competition.Code)
                    throw new ResourceNotFoundException("Participant", "Id", query.ParticipantId.ToString());

                // Quiz
                var quiz = await m_DataQuery.FetchSingle<Quiz>(q => q.Id == competition.QuizId, Quiz.CreatePartitionKeyFromId(competition.QuizId));
                
                var result = new Result
                {
                    Code = query.Code,
                    
                    QuizId = quiz.Id,
                    Name = quiz.Name,
                    CreatorName = quiz.CreatorName,
                    CreatorEmail = quiz.CreatorEmail,
                    Questions = m_Mapper.Map<List<Result.Question>>(quiz.Questions),

                    TotalQuestions = quiz.Questions.Count,

                    ParticipantId = query.ParticipantId,
                    ParticipantName = participant.Name,
                    ParticipantEmail = participant.Email
                };

                // TODO: Hmm, reliant on quiz entity serialisation in correct order?
                var x = 0;
                var c = 0;
                foreach (var question in result.Questions.Where(q => participant.Answers.ContainsKey(++x)))
                {                    
                    var participantAnswer = participant.Answers[x];
                    question.ParticipantA = participantAnswer.A;
                    question.IsCorrect = participantAnswer.IsCorrect;
                    if (participantAnswer.IsCorrect)
                        c++;
                }

                result.TotalCorrect = c;

                return result;
            }
        }
    }
}
