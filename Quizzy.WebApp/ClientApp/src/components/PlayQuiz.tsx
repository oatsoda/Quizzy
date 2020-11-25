import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import quizzesApi from '../api/quizzesApi';
import { Competition } from "../api/Competition";
import { ErrorDisplay } from './ErrorDisplay';
import { Loader } from './Loader';
import { CreateParticipant } from './CreateParticipant'
import * as signalR from '@microsoft/signalr'

export function PlayQuiz() {

  const history = useHistory();

  let { code } = useParams<{ code: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setError] = useState<string>();

  const [competition, setCompetition] = useState<Competition>();
  const [participant, setParticipant] = useState<Competition>();

    // const hubConnection = new signalR.HubConnectionBuilder()
    //   .withUrl("/signalr")
    //   .withAutomaticReconnect()
    //   .configureLogging(signalR.LogLevel.Information)  
    //   .build();

    useEffect(() => {
        const fetcher = async (qc: string) => await loadQuiz(qc);
        fetcher(code);
      }, [code]);
  
    async function loadQuiz(qc: string) : Promise<void> {
      setIsLoading(true);

      const comp = await quizzesApi.getCompetition(qc, (errMsg) => {setError(errMsg)});
      
      if (comp)
      {
        setCompetition(comp);
          //startSignalR();
      }
      
      setIsLoading(false);
    }

    // const startSignalR = useCallback(() =>  {

    //       // Starts the SignalR connection
    //       hubConnection.start().then(a => {
    //         // Once started, invokes the sendConnectionId in our ChatHub inside our ASP.NET Core application.
    //         if (hubConnection.connectionId) {
    //           hubConnection.invoke("joining", hubConnection.connectionId, "Andrew", quiz?.code);
    //         }   
    //       });

    // }, [hubConnection]);
    
    const handleCancelCreateParticipant = useCallback(() => history.push(`/`), [history]);
    const handleParticipantCreated = useCallback((p) => setParticipant(p), []);

    return (
        <Container fluid={true}>
          <Loader isLoading={isLoading} />
          <ErrorDisplay errorMessage={errorMessage} />
          <CreateParticipant visible={competition && !participant ? true : false} competition={competition} onParticipantCreated={handleParticipantCreated} onCancel={handleCancelCreateParticipant}  />
          <h1>Quiz {competition?.quiz.name}</h1>
          {/* <QuizRecv hubConnection={hubConnection} /> */}
        </Container>
    );
}

export function QuizRecv(props: { hubConnection: signalR.HubConnection}) {

  const [msg, setMsg] = useState<string>();

  useEffect(() => {
    props.hubConnection.on("joined", (name) => {
      setMsg(name + " joined");
    });
  });

  return (
    <>
    { msg && <div>{msg}</div> }
    </>
  );
}

