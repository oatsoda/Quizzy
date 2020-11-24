using System;

namespace Quizzy.WebApp.Errors
{
    public class ResourceNotFoundException : Exception
    {
        public ResourceNotFoundException(string resourceName, string resourceKey, string resourceValue) 
            : base($"Unable to find {resourceName} with {resourceKey} of {resourceValue}")
        {
        }
    }
}
