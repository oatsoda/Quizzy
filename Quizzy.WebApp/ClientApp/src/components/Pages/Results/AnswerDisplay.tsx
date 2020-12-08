import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import { AnswerNumber, SelectedAnswer } from '../Play/playTypes';

export function AnswerDisplay(props: { answerNumber: AnswerNumber; answerText: string; selectedAnswer: SelectedAnswer; correctAnswer: AnswerNumber; addMarginBottom: boolean; }) {
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
    <Col sm={6} className={addMarginBottom ? "mb-3 mb-md-0" : ""}>
      <Card className={cardClassName}>
        <CardBody>{answerLetter} {answerText}</CardBody>
      </Card>
    </Col>
  );
}
