import { AnswerNumber } from "../components/Pages/Play/playTypes"

export type Quiz = QuizNew & {
  id: string
}

export type QuizNew = {
  name: string,
  creatorName: string,
  creatorEmail: string
  questions: QuizQuestionNew[]
}

export type QuizQuestionNew = {
  q: string,
  a1: string,
  a2: string,
  a3: string,
  a4: string, 
  correctA: AnswerNumber | null
}


export function createQuizNew() : QuizNew {
  return {
    name: "",
    creatorName: "",
    creatorEmail: "",
    questions: []
  }
}

export function createQuizQuestionNew() : QuizQuestionNew {
  return {
    q: "",
    a1: "",
    a2: "",
    a3: "",
    a4: "",
    correctA: null
  };
}
