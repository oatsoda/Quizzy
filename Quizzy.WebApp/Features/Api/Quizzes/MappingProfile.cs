using Quizzy.WebApp.Data.Entities;
using AutoMapper;

namespace Quizzy.WebApp.Features.Api.Quizzes
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Post.Command, Quiz>();
            CreateMap<Quiz, Post.Result>();

            CreateMap<Quiz, Get.Result>();
        }
    }
}