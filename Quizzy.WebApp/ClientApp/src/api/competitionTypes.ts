export type CompetitionOnly = { // TODO: rename
  code: string;
  status: CompetitionStatus;
  quizId: string;
};

export type Competition = CompetitionOnly & {
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

export type CompetitionStatus = "new" | "open" | "started" | "finished";