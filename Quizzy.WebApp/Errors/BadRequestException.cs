using System;

namespace Quizzy.WebApp.Errors
{
    public class BadRequestException : Exception
    {
        public string PropertyName { get; }

        // TODO: Support multiple errors
        public BadRequestException(string propertyName, string error) 
            : base(error)
        {
            PropertyName = propertyName;
        }
    }
}
