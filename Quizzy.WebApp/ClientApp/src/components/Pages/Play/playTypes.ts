export type PlayState = {
  questionLoading: boolean;
  status: PlayStatus;
  question?: Question;
  answered: boolean;
  selectedAnswer: SelectedAnswer;
};

export type PlayStatus = "connecting" | "connected" | "joined" | "started" | "finished";

export type AnswerNumber = 1 | 2 | 3 | 4;
export type SelectedAnswer = undefined | AnswerNumber;

export type Question = {
  q: string, 
  a1: string, 
  a2: string, 
  a3: string, 
  a4: string, 
  no: number, 
  total: number
}

export type ParticipantList = {
  participants: LiveParticipant[]
}

export type LiveParticipant = {
  id: string,
  name: string,
  answeredCurrent: string,
  isConnected: boolean
}