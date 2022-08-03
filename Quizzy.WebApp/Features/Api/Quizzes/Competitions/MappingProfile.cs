using Quizzy.WebApp.Data.Entities;
using AutoMapper;

namespace Quizzy.WebApp.Features.Api.Quizzes.Competitions
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Post.Command, Competition>();
            CreateMap<Competition, Post.Result>();

            CreateMap<Competition, Get.Result>();
        }
    }
}