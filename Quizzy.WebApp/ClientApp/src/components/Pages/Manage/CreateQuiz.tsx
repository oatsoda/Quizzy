import React, { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Button, Col, CustomInput, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row } from 'reactstrap';
import quizzesApi from '../../../api/quizzesApi';
import { QuizNew, createQuizNew, QuizQuestionNew, createQuizQuestionNew } from '../../../api/quizTypes';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { useHistory } from 'react-router-dom';
import { Loader } from '../../General/Loader';
import paths from '../../Config/paths';

export function CreateQuiz() {

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [newQuiz, setNewQuiz] = useState<QuizNew>(createQuizNew());
  const [newQuizQuestions, setNewQuizQuestions] = useState<QuizQuestionNew[]>([createQuizQuestionNew()]);
  const [errorMessage, setError] = useState<string>();

  const saveNewQuiz = useCallback(async () => {

      setIsLoading(true);
      newQuiz.questions = newQuizQuestions;
      console.log(newQuiz);

      const quizCreated = await quizzesApi.postQuiz(newQuiz, (errMsg) => { setError(errMsg); });

      if (quizCreated)
        history.push(paths.ManageQuiz(quizCreated.id));
      else
        setIsLoading(false);
    },
    [newQuiz, history, newQuizQuestions]
  );

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
      console.log(`delete ${i}`)
      setNewQuizQuestions(prev => [...prev.slice(0,i), ...prev.slice(i+1)]);
    },
    []
  );

  return (
    <Form>
      <Loader isLoading={isLoading} />
      <ErrorDisplay errorMessage={errorMessage} />
      <Row form>
        <Col lg={6}>
          <FormGroup>
            <Label for="name">Quiz Name</Label>
            <Input type="text" name="name" placeholder="Enter name" onChange={handleInputChange} />
          </FormGroup>
        </Col>
      </Row>
      <Row form>
        <Col lg={4}>
          <FormGroup>
            <Label for="creatorName">Your Name</Label>
            <Input type="text" name="creatorName" placeholder="Enter your name" onChange={handleInputChange} />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Label for="creatorEmail">Your Email</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend" id="emailprepend">
                <InputGroupText>@</InputGroupText>
              </InputGroupAddon>
              <Input type="email" name="creatorEmail" placeholder="Enter your email" onChange={handleInputChange} />
            </InputGroup>
          </FormGroup>
        </Col>
      </Row>
      { newQuizQuestions.map((_, i) => (
        <QuestionInput key={i} questionIndex={i} questions={newQuizQuestions} setQuestions={setNewQuizQuestions} onRemove={removeQuestion} />)
        ) }
      <FormGroup>
        <Button color="secondary" onClick={addQuestion}>Add Question</Button>
      </FormGroup>
      <FormGroup>
        <Button color="primary" onClick={saveNewQuiz}>Create Quiz</Button>
      </FormGroup>
    </Form>
  );
}

function QuestionInput(props: { questionIndex: number, questions: QuizQuestionNew[], setQuestions: Dispatch<SetStateAction<QuizQuestionNew[]>>, onRemove: (i: number) => void }) {
  const { questionIndex, questions, setQuestions, onRemove } = props;
  const [question, setQuestion] = useState(questions[questionIndex]);

  useEffect(() => {
    setQuestion(questions[questionIndex]);
  }, [questions, questionIndex])

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name as keyof QuizQuestionNew;
      
      let val: any = (name === "correctA")
        ? Number(e.target.value)
        : e.target.value;
        
      let q = {
        ...question,
        [name]: val
      };
      setQuestion(q);

      let qs = questions;
      qs[questionIndex] = q;
      setQuestions(qs);
    },
    [question, questionIndex, questions, setQuestions]
  );

  function answerDisplay(a: string, n: number) {
    return `${n}. ${a}`;
  }

  return (
    <>
    <Row form>
      <Col>
        <FormGroup>
          <Label for="q" className="font-weight-bold">Question {questionIndex+1}</Label>
          <Input type="text" name="q" value={question.q} placeholder="Question" onChange={handleInputChange} />
        </FormGroup>
      </Col>
    </Row>
    <div className="pl-3 mb-3 border-left">
      <Row form className="mb-1">
        <Col lg={6}><Input type="text" name="a1" value={question.a1} placeholder="Answer 1" onChange={handleInputChange} className="A" /></Col>
        <Col lg={6}><Input type="text" name="a2" value={question.a2} placeholder="Answer 2" onChange={handleInputChange} className="B" /></Col>
      </Row>
      <Row form className="mb-1">
        <Col lg={6}><Input type="text" name="a3" value={question.a3} placeholder="Answer 3" onChange={handleInputChange} className="C" /></Col>
        <Col lg={6}><Input type="text" name="a4" value={question.a4} placeholder="Answer 4" onChange={handleInputChange} className="D" /></Col>
      </Row>
      <Row form>
        <Col lg={4}>
          <CustomInput type="select" name="correctA" id="correctA" value={question.correctA ?? ""} onChange={handleInputChange}>
            <option value="">Select Correct Answer</option>
            <option value={1}>{answerDisplay(question.a1, 1)}</option>
            <option value={2}>{answerDisplay(question.a2, 2)}</option>
            <option value={3}>{answerDisplay(question.a3, 3)}</option>
            <option value={4}>{answerDisplay(question.a4, 4)}</option>
          </CustomInput>
        </Col>
        { questionIndex > 0 && 
          <Col><Button color="link" onClick={() => onRemove(questionIndex)}>Delete Question</Button></Col>
        }
      </Row>
    </div>
    </>
  );
}

