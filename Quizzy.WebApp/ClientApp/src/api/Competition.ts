
export type Competition = {
  code: string;
  status: "none" | "waitingForParticipants" | "started" | "finished"
  quizId: string;
  quiz: CompetitionQuiz;
};

export type CompetitionQuiz = {
  id: string,
  name: string,
  creatorName: string,
  creatorEmail: string
}

export type Participant = {
  id: string,
  name: string,
  email: string
}

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
