import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import { MenuBar } from '../../Nav/MenuBar';
import { CompetitionResults } from './CompetitionResults';
import { ParticipantResults } from './ParticipantResults';

export function PageResults() {
  
  let { code, participantId } = useParams<{ code: string, participantId: string }>();

  const [compResultsLoaded, setCompResultsLoaded] = useState(false);

  const handleCompetitionResultsLoaded = useCallback(
    () => {
      setCompResultsLoaded(true);
    }, 
    []
  );

  return (
    <>
      <MenuBar />
      <Container>
        <CompetitionResults code={code} onLoaded={handleCompetitionResultsLoaded} />
        { compResultsLoaded && <ParticipantResults code={code} participantId={participantId} /> }
      </Container>
    </>
  );
}


