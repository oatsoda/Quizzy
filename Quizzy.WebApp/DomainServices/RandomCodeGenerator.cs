using System;
using System.Collections.Generic;
using System.Linq;

namespace Quizzy.WebApp.DomainServices
{
    public class RandomCodeGenerator
    {
        private readonly Random m_Random = new Random();

        public string GenerateCode()
        {
            var chars = new char[8];
            for (var x = 0; x < 4; x++)
                chars[x] = GetNumber();
            
            for (var x = 4; x < 8; x++)
                chars[x] = GetLetter();

            return new string(chars.OrderBy(_ => Rndm()).ToArray());
        }

        private char GetNumber() => (char)Rndm(50, 57); // Exclude Zero and One
        private char GetLetter() => (char)Rndm(65, 90); // TODO: Exclude O and I

        private int Rndm(int? from = null, int to = 0)
        {
            lock (m_Random)
                return from == null ? m_Random.Next() : m_Random.Next(from.Value, to + 1);
        }
    }
}
