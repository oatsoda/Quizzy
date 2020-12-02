export type PlayState = {
  status: "connecting" | "connected" | "joined" | "started" | "finished";
  question?: Question;
  answered: boolean;
};

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