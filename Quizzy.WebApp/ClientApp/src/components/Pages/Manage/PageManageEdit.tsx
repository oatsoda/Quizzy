import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { Quiz } from '../../../api/quizTypes';
import quizzesApi from '../../../api/quizzesApi';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Loader } from '../../General/Loader';
import { MenuBar } from '../../Nav/MenuBar';
import paths from '../../Config/paths';

export function PageManageEdit() {
  
  const history = useHistory();
  
  let { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setError] = useState<string>();

  const [quiz, setQuiz] = useState<Quiz>();

  useEffect(() => {
      const fetcher = async (i: string) => await loadQuiz(i);
      fetcher(id);
    }, 
    [id]
  );

  async function loadQuiz(i: string) : Promise<void> {

    setIsLoading(true);
    const quiz = await quizzesApi.getQuiz(i, (errMsg) => {setError(errMsg)});
    if (quiz)
      setQuiz(quiz);    
    setIsLoading(false);
  }

  const handleButtonClick = useCallback(async () => {

      setIsLoading(true);
      const newCompetition = await quizzesApi.postQuizCompetition(id, (errMsg) => { setError(errMsg); });

      if (newCompetition)
        history.push(paths.ManageCompetition(id, newCompetition.code));

      setIsLoading(false);
    },
    [id, history]
  );

  // TODO: Probably need a way to list all competitions?  Depends whether it's going to just email links rather than have a "manage" page.
  
  return (
    <>
      <MenuBar />
      <Loader isLoading={isLoading} />
      <Container>
        <ErrorDisplay errorMessage={errorMessage} />
        <h1>Quiz: {quiz?.name}</h1>
        <Button onClick={handleButtonClick} color="primary">Create a code</Button>
      </Container>
    </>
  );
}