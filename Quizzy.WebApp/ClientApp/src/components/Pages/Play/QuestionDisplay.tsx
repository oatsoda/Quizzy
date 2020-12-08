import React from 'react';
import { Row } from 'reactstrap';
import { Question, SelectedAnswer } from './playTypes';
import { AnswerDisplay } from "./AnswerDisplay";


export function QuestionDisplay(props: { question: Question; answered: boolean; selectedAnswer: SelectedAnswer; handleAnswer: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; }) {

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
