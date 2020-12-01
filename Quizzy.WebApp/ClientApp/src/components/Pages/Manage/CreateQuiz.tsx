import React, { useCallback, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import quizzesApi from '../../../api/quizzesApi';
import { QuizNew, createQuizNew, QuizQuestion } from '../../../api/quizTypes';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { useHistory } from 'react-router-dom';
import { Loader } from '../../General/Loader';


export function CreateQuiz() {

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [newQuiz, setNewQuiz] = useState<QuizNew>(createQuizNew());
  const [errorMessage, setError] = useState<string>();

  const saveNewQuiz = useCallback(async () => {

      setIsLoading(true);
      const quizCreated = await quizzesApi.postQuiz(newQuiz, (errMsg) => { setError(errMsg); });

      if (quizCreated)
        history.push(`/manage/${quizCreated.id}`);

      setIsLoading(false);
    },
    [newQuiz, history]
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

  const handleQuestionInputChange = useCallback(
    (e, i: number) => {
      let name: keyof QuizQuestion = e.target.name; // HACK for now
      let qs = newQuiz.questions;
      let q = qs[i];
      q[name] = e.target.value;

      setNewQuiz(prev => ({
        ...prev,
        questions: qs
      }));

      console.log(newQuiz);
    },
    [newQuiz]
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
      <FormGroup>        
        <Label for="q">Question</Label>
        <Input type="text" name="q" placeholder="Question" onChange={(e) => handleQuestionInputChange(e, 0)} />
        <Input type="text" name="a1" placeholder="Answer 1" onChange={(e) => handleQuestionInputChange(e, 0)} />
        <Input type="text" name="a2" placeholder="Answer 2" onChange={(e) => handleQuestionInputChange(e, 0)} />
        <Input type="text" name="a3" placeholder="Answer 3" onChange={(e) => handleQuestionInputChange(e, 0)} />
        <Input type="text" name="a4" placeholder="Answer 4" onChange={(e) => handleQuestionInputChange(e, 0)} />
        <Input type="text" name="correctA" placeholder="Correct Answer" onChange={(e) => handleQuestionInputChange(e, 0)} />
      </FormGroup>
      <FormGroup>        
        <Label for="q">Question</Label>
        <Input type="text" name="q" placeholder="Question" onChange={(e) => handleQuestionInputChange(e, 1)} />
        <Input type="text" name="a1" placeholder="Answer 1" onChange={(e) => handleQuestionInputChange(e, 1)} />
        <Input type="text" name="a2" placeholder="Answer 2" onChange={(e) => handleQuestionInputChange(e, 1)} />
        <Input type="text" name="a3" placeholder="Answer 3" onChange={(e) => handleQuestionInputChange(e, 1)} />
        <Input type="text" name="a4" placeholder="Answer 4" onChange={(e) => handleQuestionInputChange(e, 1)} />
        <Input type="text" name="correctA" placeholder="Correct Answer" onChange={(e) => handleQuestionInputChange(e, 1)} />
      </FormGroup>
      <FormGroup>
        <Button color="primary" onClick={saveNewQuiz}>Create</Button>
      </FormGroup>
    </Form>
  );
}

