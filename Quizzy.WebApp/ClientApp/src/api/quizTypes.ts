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
  correctA?: number
}


export function createQuizNew() : QuizNew {
  return {
    name: "",
    creatorName: "",
    creatorEmail: "",
    questions: [{ }, {}] // Hack: 2 qs on UI for now
  }
}