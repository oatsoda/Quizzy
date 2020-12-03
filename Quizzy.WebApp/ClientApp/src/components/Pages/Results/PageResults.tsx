import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { ParticipantResult, ParticipantResultQuestion } from '../../../api/participantTypes';
import quizzesApi from '../../../api/quizzesApi';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Loader } from '../../General/Loader';
import { MenuBar } from '../../Nav/MenuBar';
import { AnswerNumber, SelectedAnswer } from '../Play/playTypes';

export function PageResults() {
  
  let { code, participantId } = useParams<{ code: string, participantId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setError] = useState<string>();

  const [participantResult, setParticipantResult] = useState<ParticipantResult>();

  useEffect(() => {
      const fetcher = async (c: string, p: string) => await loadResults(c, p);
      fetcher(code, participantId);
    }, 
    [code, participantId]
  );

  async function loadResults(c: string, p: string) : Promise<void> {

    setIsLoading(true);
    const result = await quizzesApi.getParticipantResults(c, p, (errMsg) => {setError(errMsg)});
    if (result)
      setParticipantResult(result);    
    setIsLoading(false);
  }

  return (
    <>
      <MenuBar />
      <Loader isLoading={isLoading} />
        <Container>
        <ErrorDisplay errorMessage={errorMessage} />
        <h1>Results{ participantResult && <span className="text-muted"> for {participantResult.participantName}</span> }</h1>
        { participantResult && <> 
            <h3 className="display-4 mb-3">Score: {participantResult.totalCorrect} of {participantResult.totalQuestions}</h3>
            {
              participantResult.questions.map((q, i) => (
                <QuestionResult key={i} number={i+1} result={q} />
              ))
            }
        </>}
      </Container>
    </>
  );
}

function QuestionResult(props: { number: number, result: ParticipantResultQuestion }) {
  const { number, result } = props;
  return (
    <>
      <p className="lead font-weight-bold">{number}. {result.q}</p>
      <Row className="mb-3">
        <AnswerDisplay answerNumber={1} answerText={result.a1} selectedAnswer={result.participantA as SelectedAnswer} correctAnswer={result.correctA} addMarginBottom={true} />
        <AnswerDisplay answerNumber={2} answerText={result.a2} selectedAnswer={result.participantA as SelectedAnswer} correctAnswer={result.correctA} addMarginBottom={false} />
      </Row>
      <Row className="mb-5">
        <AnswerDisplay answerNumber={3} answerText={result.a3} selectedAnswer={result.participantA as SelectedAnswer} correctAnswer={result.correctA} addMarginBottom={true} />
        <AnswerDisplay answerNumber={4} answerText={result.a4} selectedAnswer={result.participantA as SelectedAnswer} correctAnswer={result.correctA} addMarginBottom={false} />
      </Row>
    </>
  );
}

function AnswerDisplay(props: { answerNumber: AnswerNumber, answerText: string, selectedAnswer: SelectedAnswer, correctAnswer: AnswerNumber, addMarginBottom: boolean }) {
  const { answerNumber, answerText, selectedAnswer, correctAnswer, addMarginBottom } = props;
  const answerLetter = 'ABCD'[answerNumber - 1];
  const cardClassName = answerNumber === correctAnswer && correctAnswer === selectedAnswer
    ? "bg-success text-white"
    : answerNumber === correctAnswer
      ? "bg-wrong"
      : answerNumber === selectedAnswer 
        ? `bg-danger text-white`
        : "";
  return (
    <Col sm={6} className={addMarginBottom ? "mb-3 mb-md-0" : "" }>
      <Card className={cardClassName}>
        <CardBody>{answerLetter} {answerText}</CardBody>
      </Card>
    </Col>
  );
}