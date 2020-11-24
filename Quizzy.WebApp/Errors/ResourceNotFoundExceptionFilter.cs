using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Quizzy.WebApp.Errors
{
    public class ResourceNotFoundExceptionFilter : IExceptionFilter
    {   
        public void OnException(ExceptionContext context)
        {
            if (!(context.Exception is ResourceNotFoundException exception))
                return;

            context.Result = new NotFoundObjectResult(exception.Message); // TODO: add problem details
        }
    }
}
