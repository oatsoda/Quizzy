using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Net;

namespace Quizzy.WebApp.Errors
{
    public class BadRequestExceptionFilter : IExceptionFilter
    {   
        public void OnException(ExceptionContext context)
        {
            if (context.Exception is not BadRequestException exception)
                return;

            var pd = new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Status = (int)HttpStatusCode.BadRequest,
                Title = "One or more validation errors occurred."  
            };
            pd.Extensions["errors"] = new Dictionary<string, List<string>>
            { 
                { 
                    exception.PropertyName, 
                    new List<string> 
                    { 
                        exception.Message
                    } 
                }
            };

            context.Result = new BadRequestObjectResult(pd);            
        }
    }
}