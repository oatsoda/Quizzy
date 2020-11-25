using Quizzy.WebApp.Data.Entities;
using AutoMapper;

namespace Quizzy.WebApp.Features.Api.Competitions.Participants
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Put.Command, Participant>();
            CreateMap<Participant, Put.Result>()
                .ForMember(dest => dest.CompetitionCode, x => x.MapFrom(src => src.CompId));
        }
    }
}