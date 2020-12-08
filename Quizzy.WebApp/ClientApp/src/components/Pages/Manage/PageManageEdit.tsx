import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Alert, Button, Container } from 'reactstrap';
import { Quiz } from '../../../api/quizTypes';
import quizzesApi from '../../../api/quizzesApi';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Loader } from '../../General/Loader';
import { MenuBar } from '../../Nav/MenuBar';
import paths from '../../Config/paths';
import { EditQuiz } from './EditQuiz';

export function PageManageEdit() {
  
  const history = useHistory();
  
  let { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setError] = useState<string>();
  const [createdCompetitionOk, setCreatedCompetitionOk] = useState<boolean>();

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

  const handleButtonClick = useCallback(
    async () => {

      setIsLoading(true);
      const newCompetition = await quizzesApi.postQuizCompetition(id, (errMsg) => { setError(errMsg); });

      if (newCompetition)
      {
        setQuiz(prev => ({
          ...prev!,
          competitionInfo: {
            unfinishedCompetitionExists: true,
            unfinishedCompetitionCode: newCompetition?.code
          }
        }));
        setCreatedCompetitionOk(true);
      }

      setIsLoading(false);
    },
    [id]
  );

  const handleNavButtonClick = useCallback(
    async () => {

      setIsLoading(true);
      history.push(paths.ManageCompetition(id, quiz!.competitionInfo.unfinishedCompetitionCode!));
    },
    [id, history, quiz]
  );

  // TODO: Probably need a way to list all competitions?  Depends whether it's going to just email links rather than have a "manage" page.
  
  return (
    <>
      <MenuBar />
      <Container>
        <h1>Quiz: {quiz?.name}</h1>        
        <Loader isLoading={isLoading} />
        <ErrorDisplay errorMessage={errorMessage} />

        <h3 className="mb-2">Manage competitions</h3>
        <div className="border rounded p-3 mb-3">
          { createdCompetitionOk && <Alert color="success">Competition Created Successfully</Alert> }
          <Button onClick={handleButtonClick} color="primary" disabled={quiz?.competitionInfo.unfinishedCompetitionExists}>Create a Competition Code</Button>
          { quiz?.competitionInfo.unfinishedCompetitionCode && 
            <Button onClick={handleNavButtonClick} color="primary" className="ml-3">Manage Competition</Button>
          }
        </div>     

        <h3 className="mb-3">Update quiz</h3>
        { quiz &&
          <EditQuiz quiz={quiz} />
        }
      </Container>
    </>
  );
}

