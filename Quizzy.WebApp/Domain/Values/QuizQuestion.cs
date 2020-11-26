namespace Quizzy.WebApp.Data.Entities
{
    public class QuizQuestion
    {
        public string Q { get; set; }
        public string A1 { get; set; }
        public string A2 { get; set; }
        public string A3 { get; set; }
        public string A4 { get; set; }
        public int CorrectA { get; set; }
    }
}
