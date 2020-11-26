using Quizzy.WebApp.Data.Entities;
using Quizzy.WebApp.Domain.AbstractServices;
using Quizzy.WebApp.DomainInfrastructure;
using System.Threading.Tasks;

namespace Quizzy.WebApp.DomainServices
{
    public class CompetitionCodeGenerator : ICompetitionCodeGenerator
    {
        private readonly DataQuery m_DataQuery;
        private readonly RandomCodeGenerator m_RandomCodeGenerator;

        public CompetitionCodeGenerator(DataQuery dataQuery, RandomCodeGenerator randomCodeGenerator)
        {
            m_DataQuery = dataQuery;
            m_RandomCodeGenerator = randomCodeGenerator;
        }

        public string GenerateUniqueCode() => GenerateUniqueCodeAsync().GetAwaiter().GetResult();

        public async Task<string> GenerateUniqueCodeAsync()
        {
            string newCode;
            do
            {
                newCode = m_RandomCodeGenerator.GenerateCode();
            } 
            while (await m_DataQuery.Exists<Competition>(c => c.Code == newCode, newCode));
            return newCode;
        }
    }
}
