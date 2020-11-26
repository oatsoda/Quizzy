import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { Competition, Participant } from '../api/Competition';
import { ErrorDisplay } from './ErrorDisplay';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';

export function LiveQuiz(props: { competition: Competition, participant: Participant }) {

  const { competition, participant } = props;
  
  const [errorMessage, setError] = useState<string>();
  const [hubConnection, setHubConnection] = useState<HubConnection>();
  const [playState, setPlayState] = useState<PlayState>({ status: "connecting" });
  //const [status, setStatus] = useState<"connecting" | "connected" | "joined" | "started">("connecting");
  //const [questionTotals, setQuestionTotals] = useState<{ current: number, total: number }>();

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

      hubConnection.on("joinConfirmed", (r: { participants: { id: string, name: string, connected: boolean }[], question?: Question }) => {   
        setPlayState(prev => ({...prev, status: "joined", question: r.question}));
      });

      hubConnection.on("joinFailed", (e: { errorMessage: string }) => {                  
        setError("Failed to join: " + e.errorMessage);
      });
      
      hubConnection.on("started", (q: Question) => {  
        setPlayState({ status: "joined", question: q });
      });

      hubConnection.start()
        .then(result => {
          setPlayState(prev => ({...prev, status: "connected"}));
          hubConnection.invoke("join", { participantId: participant.id, competitionCode: competition.code });
        })
        .catch(e => console.log('Connection failed: ', e));
    }
  }, [hubConnection, participant.id, competition.code]);
  
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
            <Card><CardBody>A <Button color="link" className="stretched-link">{playState.question.a1}</Button></CardBody></Card>
          </Col>
          <Col xl={6}>
            <Card><CardBody>B <Button color="link" className="stretched-link">{playState.question.a2}</Button></CardBody></Card>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xl={6}>
            <Card><CardBody>C <Button color="link" className="stretched-link">{playState.question.a3}</Button></CardBody></Card>
          </Col>
          <Col xl={6}>
            <Card><CardBody>D <Button color="link" className="stretched-link">{playState.question.a4}</Button></CardBody></Card>
          </Col>
        </Row>
      </Container>
      }
    </div>
  );
}

type PlayState = {
  status: "connecting" | "connected" | "joined" | "started",
  question?: Question
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
