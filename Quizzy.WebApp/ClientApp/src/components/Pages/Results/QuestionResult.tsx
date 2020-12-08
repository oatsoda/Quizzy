import React from 'react';
import { Row } from 'reactstrap';
import { ParticipantResultQuestion } from '../../../api/participantTypes';
import { SelectedAnswer } from '../Play/playTypes';
import { AnswerDisplay } from './AnswerDisplay';

export function QuestionResult(props: { number: number; result: ParticipantResultQuestion; }) {
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
