import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import quizzesApi, { Quiz } from '../api/quizzesApi';
import { ErrorDisplay } from './ErrorDisplay';
import * as signalR from '@microsoft/signalr'

export function PlayQuiz() {

    let { code } = useParams<{ code: string }>();

    const [errorMessage, setError] = useState<string>();
    const [quiz, setQuiz] = useState<Quiz>();

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("/signalr")
      .configureLogging(signalR.LogLevel.Information)  
      .build();

    useEffect(() => {
        const fetcher = async (qc: string) => await loadQuiz(qc);
        fetcher(code);
      }, [code]);
  
    async function loadQuiz(qc: string) : Promise<void> {
      //setIsLoading(true);

      const q = await quizzesApi.getQuiz(qc, (errMsg) => {setError(errMsg)});
      
      if (q)
      {
          setQuiz(q);
          startSignalR();
      }
      
      //setIsLoading(false);
    }

    const startSignalR = useCallback(() =>  {

          // Starts the SignalR connection
          hubConnection.start().then(a => {
            // Once started, invokes the sendConnectionId in our ChatHub inside our ASP.NET Core application.
            if (hubConnection.connectionId) {
              hubConnection.invoke("joining", hubConnection.connectionId, "Hello!");
            }   
          });

    }, [hubConnection]);

    return (
        <Container fluid={true}>
          <ErrorDisplay errorMessage={errorMessage} />
          <h1>Quiz {quiz?.name}</h1>
          <QuizRecv hubConnection={hubConnection} />
        </Container>
    );
}

export function QuizRecv(props: { hubConnection: signalR.HubConnection}) {

  const [msg, setMsg] = useState<string>();

  useEffect(() => {
    props.hubConnection.on("joined", (user, message) => {
      setMsg(message + "[" + user + "]");
    });
  });

  return (
    <>
    { msg && <div>{msg}</div> }
    </>
  );
}

