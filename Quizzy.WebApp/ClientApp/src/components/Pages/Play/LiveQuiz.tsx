import React, { useCallback, useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { Competition } from '../../../api/competitionTypes';
import { Participant } from "../../../api/participantTypes";
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Alert, Col, Row } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { ParticipantView } from './ParticipantView';
import { PlayState, Question, ParticipantList, LiveParticipant, SelectedAnswer, PlayStatus } from './playTypes';
import { Loader } from '../../General/Loader';
import { QuestionDisplay } from './QuestionDisplay';

export function LiveQuiz(props: { competition: Competition, participant: Participant }) {

  const history = useHistory();

  const { competition, participant } = props;

  const [errorMessage, setError] = useState<string>();
  const [hubConnection, setHubConnection] = useState<HubConnection>();
  const [playState, setPlayState] = useState<PlayState>({ status: "connecting", questionLoading: false, answered: false, selectedAnswer: undefined });
  const [participants, setParticipants] = useState<LiveParticipant[]>([]);

  useEffect(
    () => {
      // TODO: Avoid connecting if finished already? (visit to /quiz/{code} page)  
      if (competition.status !== "finished") {
        const newConnection = new HubConnectionBuilder()
          .withUrl("/signalr")
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        setHubConnection(newConnection);
      }
    },
    [competition.status]
  );

  useEffect(
    () => {
      if (playState.status === "finished" || competition.status === "finished")
        history.push(`/quiz/${competition.code}/results/${participant.id}`);
    }, 
    [competition.code, competition.status, history, participant.id, playState.status]
  );

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const setQuestion = useCallback(
    (q: Question, setAnswered?: boolean, setSelectedAnswer?: SelectedAnswer, setStatus?: PlayStatus) => {      
      setPlayState(prev => ({ ...prev, questionLoading: true, status: setStatus ?? prev.status }));
      (async () => {
        await delay(1000);
        setPlayState(prev => ({ ...prev, questionLoading: false, question: q, answered: setAnswered ?? false, selectedAnswer: setSelectedAnswer, status: "started" }));
      })();
    },
    []
  );

  useEffect(
    () => {
      if (hubConnection) {

        hubConnection.on("joinConfirmed", (r: { participants: ParticipantList, question?: Question, currentQuestionAnswer: SelectedAnswer }) => {
          const answered = r.currentQuestionAnswer ? true : false;
          if (r.question)
            setQuestion(r.question, answered, r.currentQuestionAnswer, "joined");
          else
            setPlayState(prev => ({ ...prev, status: "joined" }));

          setParticipants(r.participants.participants);
        });

        hubConnection.on("joinFailed", (e: { errorMessage: string }) => {
          setError("Failed to join: " + e.errorMessage);
        });

        hubConnection.on("started", (q: Question) => {
          setPlayState({ status: "started", question: q, questionLoading: false, answered: false, selectedAnswer: undefined });
        });

        hubConnection.on("participantsChanged", (p: ParticipantList) => {
          setParticipants(p.participants);
        });

        hubConnection.on("newQuestion", (q: Question) => {
          setQuestion(q);
        });

        hubConnection.on("finished", () => {
          setPlayState(prev => ({ ...prev, status: "finished", question: undefined }));
        });

        hubConnection.start()
          .then(result => {
            setPlayState(prev => ({ ...prev, status: "connected" }));
            hubConnection.invoke("join", { participantId: participant.id, competitionCode: competition.code });
          })
          .catch(e => console.log('Connection failed: ', e));
      }
    }, 
    [hubConnection, participant.id, competition.code, setQuestion]
  );

  const handleAnswer = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const answerNumber = Number(e.currentTarget.name) as SelectedAnswer;
      setPlayState(prev => ({ ...prev, answered: true, selectedAnswer: answerNumber }));
      hubConnection!.invoke("answerQuestion", { participantId: participant.id, competitionCode: competition.code, questionNo: playState.question!.no, answerNo: answerNumber });
    },
    [competition.code, hubConnection, participant.id, playState.question]
  );

  return (
    <div>
      { playState.status === "connecting" && <Alert color="info">Establishing connection to server...</Alert>}
      { playState.status === "connected" && <Alert color="info">Connected to server. Waiting for confirmation...</Alert>}
      <div className="loading-parent">
        <ErrorDisplay errorMessage={errorMessage} />
        <Row>
          <Col xl={8} className="loading-parent">
            { playState.status === "joined" && <Alert color="info">Waiting for participants to join and the quiz to start...</Alert>}
            { playState.status === "started" && playState.question && <QuestionDisplay question={playState.question!} answered={playState.answered} selectedAnswer={playState.selectedAnswer} handleAnswer={handleAnswer} />}
            <Loader isLoading={playState.questionLoading} />
          </Col>
          <Col xl={4}>
            <ParticipantView participants={participants} thisParticipant={participant} />
          </Col>
        </Row>
        <Loader isLoading={playState.status === "connecting" || playState.status === "connected" } />
      </div>
    </div>
  );
}

