import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { Competition, Participant } from '../api/Competition';
import { ErrorDisplay } from './ErrorDisplay';

export function LiveQuiz(props: { competition: Competition, participant: Participant }) {

  const { competition, participant } = props;
  
  const [errorMessage, setError] = useState<string>();
  const [hubConnection, setHubConnection] = useState<HubConnection>();
  const [status, setStatus] = useState<"connecting" | "connected" | "joined" | "started">("connecting");
  const [questionTotals, setQuestionTotals] = useState<{ current: number, total: number }>();

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("/signalr")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)  
      .build();

    setHubConnection(newConnection);
    }, 
    []
  );

  useEffect(() => {
    if (hubConnection) {

      hubConnection.on("joinConfirmed", (p: { id: string, name: string, connected: boolean }[]) => {                  
        setStatus("joined");
      });

      hubConnection.on("joinFailed", (e: { errorMessage: string }) => {                  
        setError("Failed to join: " + e.errorMessage);
      });
      
      hubConnection.on("started", (q: { q: string, a1: string, a2: string, a3: string, a4: string, no: number, total: number, }) => {                  
        setStatus("started");
        setQuestionTotals({ current: q.no, total: q.total });
      });

      hubConnection.start()
            .then(result => {
                setStatus("connected");
                hubConnection.invoke("join", { participantId: participant.id, competitionCode: competition.code });
            })
            .catch(e => console.log('Connection failed: ', e));
    }
  }, [hubConnection, participant.id, competition.code]);
  
  return (
    <div>
      <h3>{status}</h3>
      <ErrorDisplay errorMessage={errorMessage} />
      { questionTotals && <div>{questionTotals.current} of {questionTotals.total}</div>}
    </div>
  );
}

// export function QuizRecv(props: { hubConnection: signalR.HubConnection}) {

//   const [msg, setMsg] = useState<string>();

//   useEffect(() => {
//     props.hubConnection.on("joined", (name) => {
//       setMsg(name + " joined");
//     });
//   });

//   return (
//     <>
//     { msg && <div>{msg}</div> }
//     </>
//   );
// }