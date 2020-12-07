import React, { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Button, CustomInput, Form, FormGroup, Input, Label } from 'reactstrap';
import quizzesApi from '../../../api/quizzesApi';
import { QuizNew, createQuizNew, QuizQuestion } from '../../../api/quizTypes';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { useHistory } from 'react-router-dom';
import { Loader } from '../../General/Loader';
import paths from '../../Config/paths';
import { SelectedAnswer } from '../Play/playTypes';

export function CreateQuiz() {

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [newQuiz, setNewQuiz] = useState<QuizNew>(createQuizNew());
  const [newQuizQuestions, setNewQuizQuestions] = useState<QuizQuestion[]>([{ }]); // TODO: Why if I set a value e.g. { q: "test" } will that value not alter on the UI when I type to ammend it?
  const [errorMessage, setError] = useState<string>();

  const saveNewQuiz = useCallback(async () => {

      setIsLoading(true);
      newQuiz.questions = newQuizQuestions;
      console.log(newQuiz);

      const quizCreated = await quizzesApi.postQuiz(newQuiz, (errMsg) => { setError(errMsg); });

      if (quizCreated)
        history.push(paths.ManageQuiz(quizCreated.id));

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
      setNewQuizQuestions(prev => [...prev, {}]);
    },
    []
  );

  return (
    <Form>
      <Loader isLoading={isLoading} />
      <ErrorDisplay errorMessage={errorMessage} />
      <FormGroup>
        <Label for="name">Quiz Name</Label>
        <Input type="text" name="name" placeholder="Enter name" onChange={handleInputChange} />
      </FormGroup>
      <FormGroup>
        <Label for="creatorName">Your Name</Label>
        <Input type="text" name="creatorName" placeholder="Enter your name" onChange={handleInputChange} />
      </FormGroup>
      <FormGroup>
        <Label for="creatorEmail">Your Email</Label>
        <Input type="email" name="creatorEmail" placeholder="Enter your email" onChange={handleInputChange} />
      </FormGroup>
      { newQuizQuestions.map((_, i) => (
        <QuestionInput key={i} questionIndex={i} questions={newQuizQuestions} setQuestions={setNewQuizQuestions} />)
        ) }
      <FormGroup>
        <Button color="secondary" onClick={addQuestion}>Add Question</Button>
      </FormGroup>
      <FormGroup>
        <Button color="primary" onClick={saveNewQuiz}>Create</Button>
      </FormGroup>
    </Form>
  );
}

function QuestionInput(props: { questionIndex: number, questions: QuizQuestion[], setQuestions: Dispatch<SetStateAction<QuizQuestion[]>> }) {
  const { questionIndex, questions, setQuestions } = props;

  console.log(questionIndex);
  console.log(questions);
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name as keyof QuizQuestion;
      let question = questions[questionIndex]
      //console.log(`${name} = ${e.target.value} [${questionIndex}]`);
      if (name === "correctA"){
        let val = Number(e.target.value);
        question[name] = val as SelectedAnswer;
      }
      else {
        question[name] = e.target.value;
      }      

      setQuestions(questions);
    },
    [questionIndex, questions, setQuestions]
  );

  function answerDisplay(a: string | undefined, n: number) {
    return a ? `[${n}] ${a}` : `[${n}]`;
  }

  return (
    <FormGroup>
      <Label for="q">Question {questionIndex+1}</Label>
      <Input type="text" name="q" value={questions[questionIndex].q} placeholder="Question" onChange={handleInputChange} />
      <Input type="text" name="a1" value={questions[questionIndex].a1} placeholder="Answer 1" onChange={handleInputChange} />
      <Input type="text" name="a2" value={questions[questionIndex].a2} placeholder="Answer 2" onChange={handleInputChange} />
      <Input type="text" name="a3" value={questions[questionIndex].a3} placeholder="Answer 3" onChange={handleInputChange} />
      <Input type="text" name="a4" value={questions[questionIndex].a4} placeholder="Answer 4" onChange={handleInputChange} />
      <CustomInput type="select" name="correctA" id="correctA" value={questions[questionIndex].correctA} onChange={handleInputChange}>
        <option value="">Select Correct Answer</option>
        <option value={1}>{answerDisplay(questions[questionIndex].a1, 1)}</option>
        <option value={2}>{answerDisplay(questions[questionIndex].a2, 2)}</option>
        <option value={3}>{answerDisplay(questions[questionIndex].a3, 3)}</option>
        <option value={4}>{answerDisplay(questions[questionIndex].a4, 4)}</option>
      </CustomInput>

    </FormGroup>
  );
}

