import React, { useCallback, useState } from 'react';
import { Form } from 'reactstrap';
import quizzesApi from '../../../api/quizzesApi';
import { QuizNew } from '../../../api/quizTypes';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { useHistory } from 'react-router-dom';
import { Loader } from '../../General/Loader';
import paths from '../../Config/paths';
import { QuizInput } from './QuizInput';

export function CreateQuiz() {

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setError] = useState<string>();

  const saveNewQuiz = useCallback(async (newQuiz: QuizNew) => {

      setIsLoading(true);
      console.log(newQuiz);

      const quizCreated = await quizzesApi.postQuiz(newQuiz, (errMsg) => { setError(errMsg); });

      if (quizCreated)
        history.push(paths.ManageQuiz(quizCreated.id));
      else
        setIsLoading(false);
    },
    [history]
  );

  return (
    <Form>
      <Loader isLoading={isLoading} />
      <ErrorDisplay errorMessage={errorMessage} />
      <QuizInput onSaveRequested={saveNewQuiz} />
    </Form>
  );
}


