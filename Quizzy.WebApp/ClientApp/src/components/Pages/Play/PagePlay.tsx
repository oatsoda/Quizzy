import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import quizzesApi from '../../../api/quizzesApi';
import { Competition } from "../../../api/competitionTypes";
import { Participant } from "../../../api/participantTypes";
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Loader } from '../../General/Loader';
import { CreateParticipant } from './CreateParticipant'
import { LiveQuiz } from './LiveQuiz'
import { MenuBar } from '../../Nav/MenuBar';

export function PagePlay() {

  const history = useHistory();

  let { code } = useParams<{ code: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setError] = useState<string>();

  const [competition, setCompetition] = useState<Competition>();
  const [participant, setParticipant] = useState<Participant>();

  useEffect(() => {
      const fetcher = async (qc: string) => await loadQuiz(qc);
      fetcher(code);
    }, 
    [code]
  );

  async function loadQuiz(qc: string) : Promise<void> {

    setIsLoading(true);
    const comp = await quizzesApi.getCompetition(qc, (errMsg) => {setError(errMsg)});
    if (comp)
      setCompetition(comp);    
    setIsLoading(false);
  }

  const handleCancelCreateParticipant = useCallback(() => history.push(`/`), [history]);
  const handleParticipantCreated = useCallback((p : Participant) => setParticipant(p), []);

  return (
    <>
      <MenuBar />
      <Container>
        <Loader isLoading={isLoading} />
        <ErrorDisplay errorMessage={errorMessage} />
        <h1>Playing: {competition?.quiz.name}</h1>
        { competition && !participant &&
          <>
            <CreateParticipant competition={competition} onParticipantCreated={handleParticipantCreated} onCancel={handleCancelCreateParticipant}  />          
            <p>Participant details required...</p>
          </>
        }
        { competition && participant &&
          <LiveQuiz competition={competition} participant={participant} />
        }
      </Container>
    </>
  );
}