using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.DomainInfrastructure;
using Quizzy.WebApp.Errors;
using System;
using System.Threading.Tasks;

namespace Quizzy.WebApp.DomainServices
{
    public class UnfinishedCompetitionChecker
    {
        private readonly DataQuery m_DataQuery;

        public UnfinishedCompetitionChecker(DataQuery dataQuery)
        {
            m_DataQuery = dataQuery;
        }

        public async Task<bool> CheckForUnfinishedCompetitions(Guid quizId, bool throwBadRequest = true)
        {
            // TODO: Cross partition query
            var unfinishedComp = await m_DataQuery.Exists<Competition>(c => c.QuizId == quizId && c.Status != CompetitionStatus.Finished, null);

            if (unfinishedComp && throwBadRequest)
                throw new BadRequestException("QuizId", "There is already a competition running for this quiz. You can only have a single competition running at a time.");

            return unfinishedComp;
        }
    }
}
