import React, { useCallback, useState } from 'react';
import { Button, Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row } from 'reactstrap';
import { QuizNew, createQuizNew, QuizQuestion, createQuizQuestionNew } from '../../../api/quizTypes';
import { QuestionInput } from './QuestionInput';


export function QuizInput(props: { quiz?: QuizNew; onSaveRequested: (quiz: QuizNew) => Promise<void>; }) {
  const { onSaveRequested } = props;
  const saveButtonCaption = props.quiz ? "Update Quiz" : "Create Quiz";
  const [newQuiz, setNewQuiz] = useState<QuizNew>(props.quiz ? props.quiz : createQuizNew());
  const [newQuizQuestions, setNewQuizQuestions] = useState<QuizQuestion[]>(props.quiz ? props.quiz.questions : [createQuizQuestionNew()]);

  const handleInputChange = useCallback(
    (e) => {
      const target = e.target;
      setNewQuiz(prev => ({
        ...prev,
        [target.name]: target.value
      }));
    },
    []
  );

  const addQuestion = useCallback(
    (_) => {
      setNewQuizQuestions(prev => [...prev, createQuizQuestionNew()]);
    },
    []
  );

  const removeQuestion = useCallback(
    (i: number) => {
      console.log(`delete ${i}`);
      setNewQuizQuestions(prev => [...prev.slice(0, i), ...prev.slice(i + 1)]);
    },
    []
  );

  const onSave = useCallback(
    async () => {
      newQuiz.questions = newQuizQuestions;
      await onSaveRequested(newQuiz);
    },
    [newQuiz, newQuizQuestions, onSaveRequested]
  );

  return (
    <>
      <Row form>
        <Col lg={6}>
          <FormGroup>
            <Label for="name">Quiz Name</Label>
            <Input type="text" name="name" placeholder="Enter name" value={newQuiz.name} onChange={handleInputChange} />
          </FormGroup>
        </Col>
      </Row>
      <Row form>
        <Col lg={4}>
          <FormGroup>
            <Label for="creatorName">Your Name</Label>
            <Input type="text" name="creatorName" placeholder="Enter your name" value={newQuiz.creatorName} onChange={handleInputChange} />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Label for="creatorEmail">Your Email</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend" id="emailprepend">
                <InputGroupText>@</InputGroupText>
              </InputGroupAddon>
              <Input type="email" name="creatorEmail" placeholder="Enter your email" value={newQuiz.creatorEmail} onChange={handleInputChange} />
            </InputGroup>
          </FormGroup>
        </Col>
      </Row>
      {newQuizQuestions.map((_, i) => (
        <QuestionInput key={i} questionIndex={i} questions={newQuizQuestions} setQuestions={setNewQuizQuestions} onRemove={removeQuestion} />)
      )}
      <FormGroup>
        <Button color="secondary" onClick={addQuestion}>Add Question</Button>
      </FormGroup>
      <FormGroup>
        <Button color="primary" onClick={onSave}>{saveButtonCaption}</Button>
      </FormGroup>
    </>
  );
}
