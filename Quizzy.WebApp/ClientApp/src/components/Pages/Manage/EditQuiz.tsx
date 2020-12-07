import React, { useCallback, useState } from 'react';
import { Form } from 'reactstrap';
import { Quiz, QuizNew } from '../../../api/quizTypes';
import quizzesApi from '../../../api/quizzesApi';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Loader } from '../../General/Loader';
import { QuizInput } from "./QuizInput";


export function EditQuiz(props: { quiz: Quiz; }) {

  const { quiz } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setError] = useState<string>();

  const saveUpdatedQuiz = useCallback(async (newQuiz: QuizNew) => {

    setIsLoading(true);
    console.log(newQuiz);

    const quizUpdated = await quizzesApi.putQuiz(quiz.id, newQuiz, (errMsg) => { setError(errMsg); });

    setIsLoading(false);
  },
    [quiz.id]
  );

  return (
    <Form>
      <Loader isLoading={isLoading} />
      <ErrorDisplay errorMessage={errorMessage} />
      <QuizInput quiz={quiz} onSaveRequested={saveUpdatedQuiz} />
    </Form>
  );
}
