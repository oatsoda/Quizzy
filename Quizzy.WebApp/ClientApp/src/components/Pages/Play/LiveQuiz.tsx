import React, { useCallback, useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { Competition } from '../../../api/competitionTypes';
import { Participant } from "../../../api/participantTypes";
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Alert, Button, Card, CardBody, Col, Row } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { ParticipantView } from './ParticipantView';
import { PlayState, Question, ParticipantList, LiveParticipant, SelectedAnswer, Answers as AnswerNumber } from './playTypes';

export function LiveQuiz(props: { competition: Competition, participant: Participant }) {

  const history = useHistory();
  
  const { competition, participant } = props;
  
  const [errorMessage, setError] = useState<string>();
  const [hubConnection, setHubConnection] = useState<HubConnection>();
  const [playState, setPlayState] = useState<PlayState>({ status: "connecting", answered: false, selectedAnswer: undefined });
  const [participants, setParticipants] = useState<LiveParticipant[]>([]);

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

      hubConnection.on("joinConfirmed", (r: { participants: ParticipantList, question?: Question, currentQuestionAnswer: SelectedAnswer }) => { 
        const joinState = r.question ? "started" : "joined";
        const answered = r.currentQuestionAnswer ? true : false;
        setPlayState(prev => ({ ...prev, status: joinState, question: r.question, answered: answered, selectedAnswer: r.currentQuestionAnswer }));
        setParticipants(r.participants.participants);
      });

      hubConnection.on("joinFailed", (e: { errorMessage: string }) => {                  
        setError("Failed to join: " + e.errorMessage);
      });
      
      hubConnection.on("started", (q: Question) => {  
        setPlayState({ status: "started", question: q, answered: false, selectedAnswer: undefined });        
      });
      
      hubConnection.on("participantsChanged", (p: ParticipantList) => {                  
        setParticipants(p.participants);
      });

      hubConnection.on("newQuestion", (q: Question) => {  
        // TODO: Replace fake delay with transition / something on the UI to make people realise there is a new question!
        console.log(`newQuestion: ${q.q}`);
        (async () => { 
          await delay(1000); 
          setPlayState(prev => ({ ...prev, question: q, answered: false, selectedAnswer: undefined }));
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
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { 
      const answerNumber = Number(e.currentTarget.name) as SelectedAnswer;
      setPlayState(prev => ({ ...prev, answered: true, selectedAnswer: answerNumber }));
      console.log("ANSWER: " + participant.id + " / " + competition.code + " @ " + playState.question?.no + " - " + answerNumber);
      hubConnection!.invoke("answerQuestion", { participantId: participant.id, competitionCode: competition.code, questionNo: playState.question!.no, answerNo: answerNumber });
    },
    [competition.code, hubConnection, participant.id, playState.question]
  );

  return (
    <div>
      <ErrorDisplay errorMessage={errorMessage} />      
      <Row>
        <Col xl={8}>
        { playState.status === "connecting" && <Alert color="info">Establishing connection to server...</Alert> }
        { playState.status === "connected" && <Alert color="info">Connected to server. Waiting for confirmation...</Alert> }
        { playState.status === "joined" && <Alert color="info">Waiting for participants to join and the quiz to start...</Alert>}
        { playState.status === "started" && <QuestionDisplay question={playState.question!} answered={playState.answered} selectedAnswer={playState.selectedAnswer} handleAnswer={handleAnswer} /> }
        </Col>
        <Col xl={4}>
          <ParticipantView participants={participants} thisParticipant={participant} />
        </Col>
      </Row>
    </div>
  );
}

export function QuestionDisplay(props: { question: Question, answered: boolean, selectedAnswer: SelectedAnswer, handleAnswer: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }) {

  const { question, answered, selectedAnswer, handleAnswer } = props;

  return (
    <>
      <div className="font-italic">{question.no} of {question.total}</div>
      <p className="lead font-weight-bold">{question.q}</p>
      <Row className="mb-3">
        <AnswerDisplay answerNumber={1} answerText={question.a1} answered={answered} selectedAnswer={selectedAnswer} addMarginBottom={true} handleAnswer={handleAnswer} />
        <AnswerDisplay answerNumber={2} answerText={question.a2} answered={answered} selectedAnswer={selectedAnswer} addMarginBottom={false} handleAnswer={handleAnswer} />
      </Row>
      <Row className="mb-3">
        <AnswerDisplay answerNumber={3} answerText={question.a3} answered={answered} selectedAnswer={selectedAnswer} addMarginBottom={true} handleAnswer={handleAnswer} />
        <AnswerDisplay answerNumber={4} answerText={question.a4} answered={answered} selectedAnswer={selectedAnswer} addMarginBottom={false} handleAnswer={handleAnswer} />
      </Row>
    </>
  );
}

function AnswerDisplay(props: { answerNumber: AnswerNumber, answerText: string, answered: boolean, selectedAnswer: SelectedAnswer, addMarginBottom: boolean, handleAnswer: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }) {
  const { answerNumber, answerText, answered, selectedAnswer, addMarginBottom, handleAnswer } = props;
  const answerLetter = String.fromCharCode(64 + answerNumber);
  const cardClassName = answerNumber === selectedAnswer ? `bg-primary text-white ${answerLetter}` : answerLetter;
  const buttonClassName = answerNumber === selectedAnswer ? "stretched-link text-white font-weight-bold" : "stretched-link";
  return (
    <Col sm={6} className={addMarginBottom ? "mb-3 mb-md-0" : "" }>
      <Card className={cardClassName}>
        <CardBody>{answerLetter} <Button color="link" className={buttonClassName} name={answerNumber.toString()} onClick={handleAnswer} disabled={answered}>{answerText}</Button></CardBody>
      </Card>
    </Col>
  );
}