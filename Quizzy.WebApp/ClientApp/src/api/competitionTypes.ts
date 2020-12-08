export type CompetitionOnly = { // TODO: rename
  code: string;
  status: CompetitionStatus;
  quizId: string;
};

export type Competition = CompetitionOnly & {
  quiz: CompetitionQuiz;
  outcome: CompetitionOutcome
};

export type CompetitionQuiz = {
  id: string,
  name: string,
  creatorName: string,
  creatorEmail: string
}

export type CompetitionStatus = "new" | "open" | "started" | "finished";

export type CompetitionOutcome = {
  totalQuestions: number,
  first: CompetitionOutcomeLeader,
  second?: CompetitionOutcomeLeader,
  third?: CompetitionOutcomeLeader,
}

export type CompetitionOutcomeLeader = {
  name: string,
  correctAnswers: number
}