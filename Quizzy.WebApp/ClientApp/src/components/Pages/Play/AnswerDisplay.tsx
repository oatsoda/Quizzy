import React from 'react';
import { Button, Card, CardBody, Col } from 'reactstrap';
import { SelectedAnswer, AnswerNumber } from './playTypes';


export function AnswerDisplay(props: { answerNumber: AnswerNumber; answerText: string; answered: boolean; selectedAnswer: SelectedAnswer; addMarginBottom: boolean; handleAnswer: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; }) {
  const { answerNumber, answerText, answered, selectedAnswer, addMarginBottom, handleAnswer } = props;
  const answerLetter = 'ABCD'[answerNumber - 1];
  const cardClassName = answerNumber === selectedAnswer ? `bg-primary text-white ${answerLetter}` : answerLetter;
  const buttonClassName = answerNumber === selectedAnswer ? "stretched-link text-white font-weight-bold" : "stretched-link";
  return (
    <Col sm={6} className={addMarginBottom ? "mb-3 mb-md-0" : ""}>
      <Card className={cardClassName}>
        <CardBody>{answerLetter} <Button color="link" className={buttonClassName} name={answerNumber.toString()} onClick={handleAnswer} disabled={answered}>{answerText}</Button></CardBody>
      </Card>
    </Col>
  );
}
