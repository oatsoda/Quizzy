import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { CompetitionOnly } from '../../../../api/competitionTypes';
import quizzesApi from '../../../../api/quizzesApi';
import { ErrorDisplay } from '../../../General/ErrorDisplay';
import { Loader } from '../../../General/Loader';
import { MenuBar } from '../../../Nav/MenuBar';

export function PageCompetition() {
  
  let { id, code } = useParams<{ id: string, code: string }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setError] = useState<string>();

  const [quizCompetition, setQuizCompetition] = useState<CompetitionOnly>();

  useEffect(() => {
      const fetcher = async (i: string, c: string) => await loadQuizCompetition(i, c);
      fetcher(id, code);
    }, 
    [id, code]
  );

  async function loadQuizCompetition(i: string, c: string) : Promise<void> {

    setIsLoading(true);
    const quizComp = await quizzesApi.getQuizCompetition(i, c, (errMsg) => {setError(errMsg)});
    if (quizComp)
      setQuizCompetition(quizComp);    
    setIsLoading(false);
  }

  const updateCompetitionStatus = useCallback(async (status: "open" | "start") => {
      setIsLoading(true);
      const success = await quizzesApi.postQuizCompetitionStatusChange(id, code, status, (errMsg) => { setError(errMsg); });

      if (success)
        setQuizCompetition(prev => ({
          ...prev!,
          status: status === "start" ? "started" : status
        }));

      setIsLoading(false);

    },
    [id, code]
  );
  const handleOpen = useCallback(async () => {

      await updateCompetitionStatus("open");
    },
    [updateCompetitionStatus]
  );
  const handleStart = useCallback(async () => {
    
      await updateCompetitionStatus("start");
    },
    [updateCompetitionStatus]
  );

  return (
    <>
      <MenuBar />
      <Loader isLoading={isLoading} />
      <Container>
        <ErrorDisplay errorMessage={errorMessage} />
        <h1>Competition {code}</h1>
        <h2>Status: {quizCompetition?.status}</h2>
        { quizCompetition && quizCompetition.status === "new" &&
          <Button onClick={handleOpen} color="primary">Open for participants to register</Button> }
        { quizCompetition && quizCompetition.status === "open" &&
          <Button onClick={handleStart} color="primary">Start competition</Button> }
      </Container>
    </>
  );
}