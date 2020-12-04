export class Paths {
  CreateQuiz = "/create";
  ManageQuiz(quizId: string) { return `/manage/${quizId}`; }
  ManageCompetition(quizId: string, code: string) { return `/manage/${quizId}/${code}`; }
  
  PlayCompetition(code: string) { return `/quiz/${code}`; }
}

const paths = new Paths();
export default paths;