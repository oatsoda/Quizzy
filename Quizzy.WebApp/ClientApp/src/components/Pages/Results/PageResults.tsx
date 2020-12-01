import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import { ParticipantResult, ParticipantResultQuestion } from '../../../api/participantTypes';
import quizzesApi from '../../../api/quizzesApi';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Loader } from '../../General/Loader';
import { MenuBar } from '../../Nav/MenuBar';

export function PageResults() {
  
  let { code, participantId } = useParams<{ code: string, participantId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setError] = useState<string>();

  const [participantResult, setParticipantResult] = useState<ParticipantResult>();

  useEffect(() => {
      const fetcher = async (c: string, p: string) => await loadResults(c, p);
      fetcher(code, participantId);
    }, 
    [code, participantId]
  );

  async function loadResults(c: string, p: string) : Promise<void> {

    setIsLoading(true);
    const result = await quizzesApi.getParticipantResults(c, p, (errMsg) => {setError(errMsg)});
    if (result)
      setParticipantResult(result);    
    setIsLoading(false);
  }


  return (
    <>
      <MenuBar />
      <Loader isLoading={isLoading} />
        <Container>
        <ErrorDisplay errorMessage={errorMessage} />
        <h1>Results</h1>
        { participantResult && <> 
            <h2>Name: {participantResult.participantName}</h2>
            <h3>Score: {participantResult.totalCorrect} of {participantResult.totalQuestions}</h3>
            {
              participantResult.questions.map(q => (
                <QuestionResult result={q} />
              ))
            }
        </>}
      </Container>
    </>
  );
}

function QuestionResult(props: { result: ParticipantResultQuestion }) {
  const { result } = props;
  return (
    <>
      <p>Q: {result.q} {result.isCorrect && ' CORRECT'}</p>
      {!result.isCorrect && 
        <ul>
          <li>{result.a1} {result.correctA === 1 && ' Correct Answer'}{result.participantA === 1 && ' Wrong Answer'}</li>
          <li>{result.a2} {result.correctA === 2 && ' Correct Answer'}{result.participantA === 2 && ' Wrong Answer'}</li>
          <li>{result.a3} {result.correctA === 3 && ' Correct Answer'}{result.participantA === 3 && ' Wrong Answer'}</li>
          <li>{result.a4} {result.correctA === 4 && ' Correct Answer'}{result.participantA === 4 && ' Wrong Answer'}</li>
        </ul>}
    </>
  );
}