import { SelectedAnswer } from "../components/Pages/Play/playTypes"

export type Quiz = QuizNew & {
  id: string
}

export type QuizNew = {
  name: string,
  creatorName: string,
  creatorEmail: string
  questions: QuizQuestion[]
}

export type QuizQuestion = {
  q?: string,
  a1?: string,
  a2?: string,
  a3?: string,
  a4?: string, 
  correctA?: SelectedAnswer
}


export function createQuizNew() : QuizNew {
  return {
    name: "",
    creatorName: "",
    creatorEmail: "",
    questions: []
  }
}