using System.Threading.Tasks;

namespace Quizzy.WebApp.Domain.AbstractServices
{
    public interface ICompetitionCodeGenerator
    {
        string GenerateUniqueCode();
    }
}
