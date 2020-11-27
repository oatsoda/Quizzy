import React, { useCallback, useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { Competition, Participant } from '../api/Competition';
import { ErrorDisplay } from './ErrorDisplay';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export function LiveQuiz(props: { competition: Competition, participant: Participant }) {

  const history = useHistory();
  
  const { competition, participant } = props;
  
  const [errorMessage, setError] = useState<string>();
  const [hubConnection, setHubConnection] = useState<HubConnection>();
  const [playState, setPlayState] = useState<PlayState>({ status: "connecting", answered: false });

  useEffect(() => {
    // TODO: Avoid connecting if finished already? (visit to /quiz/{code} page)
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

    console.log(`STATUS CHECK ${playState.status} || ${competition.status}`);
    if (playState.status === "finished" || competition.status === "finished") 
      history.push(`/quiz/${competition.code}/results/${participant.id}`);

  }, [competition.code, competition.status, history, participant.id, playState.status])

  useEffect(() => {
    if (hubConnection) {

      hubConnection.on("joinConfirmed", (r: { participants: { id: string, name: string, connected: boolean }[], question?: Question }) => {   
        setPlayState(prev => ({ ...prev, status: "joined", question: r.question }));
      });

      hubConnection.on("joinFailed", (e: { errorMessage: string }) => {                  
        setError("Failed to join: " + e.errorMessage);
      });
      
      hubConnection.on("started", (q: Question) => {  
        setPlayState({ status: "joined", question: q, answered: false });
      });
      
      hubConnection.on("newQuestion", (q: Question) => {  
        // TODO: Replace fake delay with transition / something on the UI to make people realise there is a new question!
        (async () => { 
          await delay(1000); 
          setPlayState(prev => ({ ...prev, question: q, answered: false }));
        })();
      });

      hubConnection.on("finished", () => {  
        setPlayState(prev => ({ ...prev, status: "finished", question: undefined }));
      });

      hubConnection.start()
        .then(result => {
          setPlayState(prev => ({...prev, status: "connected"}));
          hubConnection.invoke("join", { participantId: participant.id, competitionCode: competition.code });
        })
        .catch(e => console.log('Connection failed: ', e));
    }
  }, [hubConnection, participant.id, competition.code]);
  
  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  const handleAnswer = useCallback(
    (e) => {        
      setPlayState(prev => ({ ...prev, answered: false }));
      console.log("ANSWER: " + participant.id + " / " + competition.code + " @ " + playState.question?.no + " - " + e.target.name);
      hubConnection!.invoke("answerQuestion", { participantId: participant.id, competitionCode: competition.code, questionNo: playState.question!.no, answerNo: Number(e.target.name) });
    },
    [competition.code, hubConnection, participant.id, playState.question]
  );

  return (
    <div>
      <h3>{playState.status}</h3>
      <ErrorDisplay errorMessage={errorMessage} />
      { playState.question && 
      <Container>
        <div>{playState.question.no} of {playState.question.total}</div>
        <h4>{playState.question.q}</h4>
        <Row className="mb-3">
          <Col xl={6} >
            <Card><CardBody>A <Button color="link" className="stretched-link" name="1" onClick={handleAnswer} disabled={playState.answered}>{playState.question.a1}</Button></CardBody></Card>
          </Col>
          <Col xl={6}>
            <Card><CardBody>B <Button color="link" className="stretched-link" name="2" onClick={handleAnswer} disabled={playState.answered}>{playState.question.a2}</Button></CardBody></Card>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xl={6}>
            <Card><CardBody>C <Button color="link" className="stretched-link" name="3" onClick={handleAnswer} disabled={playState.answered}>{playState.question.a3}</Button></CardBody></Card>
          </Col>
          <Col xl={6}>
            <Card><CardBody>D <Button color="link" className="stretched-link" name="4" onClick={handleAnswer} disabled={playState.answered}>{playState.question.a4}</Button></CardBody></Card>
          </Col>
        </Row>
      </Container>
      }
    </div>
  );
}

type PlayState = {
  status: "connecting" | "connected" | "joined" | "started" | "finished",
  question?: Question,
  answered: boolean
}

type Question = {
  q: string, 
  a1: string, 
  a2: string, 
  a3: string, 
  a4: string, 
  no: number, 
  total: number
}
