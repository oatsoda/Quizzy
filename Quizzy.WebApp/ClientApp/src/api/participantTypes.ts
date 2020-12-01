
export type Participant = {
  id: string;
  name: string;
  email: string;
};

export type ParticipantNew = {
  name: string,
  email: string
}

export function createParticipantNew() : ParticipantNew {
  return {
    name: "",
    email: ""    
  }
}

export type ParticipantResult = {
  code: string,
  participantId: string,
  quizId: string,
  name: string,
  creatorEmail: string,
  creatorName: string,
  participantEmail: string,
  participantName: string,
  totalQuestions: number,
  totalCorrect: number,
  questions: ParticipantResultQuestion[]
}

export type ParticipantResultQuestion = {
  q: string,
  a1: string,
  a2: string,
  a3: string,
  a4: string, 
  correctA: number,
  participantA: number,
  isCorrect: boolean
}