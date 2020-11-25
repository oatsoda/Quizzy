using Quizzy.WebApp.Data.Entities;
using AutoMapper;

namespace Quizzy.WebApp.Features.Api.Competitions
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Competition, Get.Result>();
            CreateMap<Quiz, Get.Result.ResultQuiz>();
        }
    }
}