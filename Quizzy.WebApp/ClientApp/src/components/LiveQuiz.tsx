import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { Competition, Participant } from '../api/Competition';

export function LiveQuiz(props: { competition: Competition, participant: Participant }) {

  const { competition, participant } = props;

  const [hubConnection, setHubConnection] = useState<HubConnection>();

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
      hubConnection.start()
            .then(result => {
                console.log('Connected!');

                hubConnection.on("joined", (p: { id: string }) => {
                  console.log("JOINED: " + p.id);
                });

                hubConnection.invoke("join", { participantId: participant.id });
            })
            .catch(e => console.log('Connection failed: ', e));
    }
  }, [hubConnection, participant.id]);
  
  return (<div></div>);
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