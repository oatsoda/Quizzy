using Quizzy.WebApp.Data.Entities;
using AutoMapper;

namespace Quizzy.WebApp.Features.Api.Quizzes
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Post.Command, Quiz>();
            CreateMap<Post.Command.Question, QuizQuestion>();
            CreateMap<Quiz, Post.Result>();
            CreateMap<QuizQuestion, Post.Command.Question>();

            CreateMap<Quiz, Get.Result>();
            CreateMap<QuizQuestion, Get.Result.Question>();
            
            CreateMap<Put.Command, Quiz>();
            CreateMap<Put.Command.Question, QuizQuestion>();
            CreateMap<Quiz, Put.Result>();
            CreateMap<QuizQuestion, Put.Command.Question>();
        }
    }
}