using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Net;

namespace Quizzy.WebApp.Errors
{
    public class ResourceNotFoundExceptionFilter : IExceptionFilter
    {   
        public void OnException(ExceptionContext context)
        {
            if (context.Exception is not ResourceNotFoundException exception)
                return;

            var pd = new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Status = (int)HttpStatusCode.NotFound,
                Title = "Resource could not be found."  
            };
            pd.Extensions["errors"] = new List<string> { exception.Message };

            context.Result = new NotFoundObjectResult(pd);            
        }
    }
}

