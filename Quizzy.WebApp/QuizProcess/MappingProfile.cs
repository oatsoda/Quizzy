using AutoMapper;
using Quizzy.WebApp.Data.Entities;

namespace Quizzy.WebApp.QuizProcess
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<QuizQuestion, Question>();
        }
    }

}
