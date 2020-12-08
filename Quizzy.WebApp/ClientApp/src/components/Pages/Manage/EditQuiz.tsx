import React, { useCallback, useState } from 'react';
import { Alert, Form } from 'reactstrap';
import { Quiz, QuizNew } from '../../../api/quizTypes';
import quizzesApi from '../../../api/quizzesApi';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Loader } from '../../General/Loader';
import { QuizInput } from "./QuizInput";


export function EditQuiz(props: { quiz: Quiz; }) {

  const { quiz } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setError] = useState<string>();
  const [savedOk, setSavedOk] = useState<boolean>();

  const saveUpdatedQuiz = useCallback(async (newQuiz: QuizNew) => {

    setIsLoading(true);
    setError(undefined);
    setSavedOk(false);
    console.log(newQuiz);

    const quizUpdated = await quizzesApi.putQuiz(quiz.id, newQuiz, (errMsg) => { setError(errMsg); });

    if (quizUpdated)
      setSavedOk(true);

    setIsLoading(false);
  },
    [quiz.id]
  );

  return (
    <Form>
      <Loader isLoading={isLoading} />
      <ErrorDisplay errorMessage={errorMessage} />
      { savedOk && <Alert color="success">Quiz Updated Successfully</Alert> }
      <QuizInput quiz={quiz} disabled={quiz.competitionInfo.unfinishedCompetitionExists} onSaveRequested={saveUpdatedQuiz} />
    </Form>
  );
}
