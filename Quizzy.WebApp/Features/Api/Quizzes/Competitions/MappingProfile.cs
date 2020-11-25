﻿using Quizzy.WebApp.Data.Entities;
using AutoMapper;

namespace Quizzy.WebApp.Features.Api.Quizzes.Competitions
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Put.Command, Competition>();
            CreateMap<Competition, Put.Result>();

            CreateMap<Competition, Get.Result>();
        }
    }
}