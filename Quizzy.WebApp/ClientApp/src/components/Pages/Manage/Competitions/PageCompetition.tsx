import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Container } from 'reactstrap';
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
    const quizComp = await quizzesApi.getQuizCompetition(i, c, setError);
    if (quizComp)
      setQuizCompetition(quizComp);    
    setIsLoading(false);
  }

  const updateCompetitionStatus = useCallback(async (status: "open" | "start") => {
      setIsLoading(true);
      const success = await quizzesApi.postQuizCompetitionStatusChange(id, code, status, setError);

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
      <Container>
        <h1>Competition {code}</h1>
        <h2>Status: {quizCompetition?.status}</h2>
        <Loader isLoading={isLoading} />
        <ErrorDisplay errorMessage={errorMessage} />
        <Alert color={quizCompetition?.status === "finished" ? "warning" : "info"}>{
          quizCompetition?.status === "new"
            ? "When you are ready for participants to register, Open the competition."
            : quizCompetition?.status === "open"
              ? "While the competition is in the Open status, your participants can register and connect if they have the Code.  Wait for all your participants to register and only choose Start once they are all ready for the first question."
              : quizCompetition?.status === "started"
                ? "The competition is Live. No new participants can register. Should any of the participants disconnect, they can still enter the Code to rejoin."
                : "The competition has finished and results have been determined."
        }</Alert>
        { quizCompetition && quizCompetition.status === "new" &&
          <Button onClick={handleOpen} color="primary">Open for participants to register</Button> }
        { quizCompetition && quizCompetition.status === "open" &&
          <Button onClick={handleStart} color="primary">Start competition</Button> }
      </Container>
    </>
  );
}