import React, { useCallback, useState } from 'react';
import { Form } from 'reactstrap';
import quizzesApi from '../../../api/quizzesApi';
import { QuizNew } from '../../../api/quizTypes';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { useHistory } from 'react-router-dom';
import { Loader } from '../../General/Loader';
import paths from '../../Config/paths';
import { QuizInput } from './QuizInput';
import { IValidationErrors } from '../../../api/validationTypes';

export function CreateQuiz() {

  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setError] = useState<string>();
  const [validationErrors, setValidationErrors] = useState<IValidationErrors>();

  const saveNewQuiz = useCallback(async (newQuiz: QuizNew) => {

      setIsLoading(true);
      setError(undefined);
      setValidationErrors(undefined);
      console.log(newQuiz);

      const quizCreated = await quizzesApi.postQuiz(newQuiz, setError, setValidationErrors);

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
      <QuizInput validationErrors={validationErrors} disabled={false} onSaveRequested={saveNewQuiz} />
    </Form>
  );
}


