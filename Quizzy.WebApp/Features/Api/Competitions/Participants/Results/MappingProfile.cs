using Quizzy.WebApp.Data.Entities;
using AutoMapper;

namespace Quizzy.WebApp.Features.Api.Competitions.Participants.Results
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<QuizQuestion, Get.Result.Question>();
        }
    }
}