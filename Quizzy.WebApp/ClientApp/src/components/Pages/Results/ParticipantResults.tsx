import React, { useEffect, useState } from 'react';
import { ParticipantResult } from '../../../api/participantTypes';
import quizzesApi from '../../../api/quizzesApi';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Loader } from '../../General/Loader';
import { QuestionResult } from './QuestionResult';


export function ParticipantResults(props: { code: string; participantId: string; }) {
  const { code, participantId } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setError] = useState<string>();

  const [participantResult, setParticipantResult] = useState<ParticipantResult>();

  useEffect(() => {
    const fetcher = async (c: string, p: string) => await loadResults(c, p);
    fetcher(code, participantId);
  },
    [code, participantId]
  );

  async function loadResults(c: string, p: string): Promise<void> {

    const result = await quizzesApi.getParticipantResults(c, p, (errMsg) => { setError(errMsg); });
    if (result)
      setParticipantResult(result);
    setIsLoading(false);
  }

  return (
    <>
      <Loader isLoading={isLoading} />
      <ErrorDisplay errorMessage={errorMessage} />
      <h2>Results{participantResult && <span className="text-muted"> for {participantResult.participantName}</span>}</h2>
      {participantResult && <>
        <h3 className="display-4 mb-3">Score: {participantResult.totalCorrect} of {participantResult.totalQuestions}</h3>
        {participantResult.questions.map((q, i) => (
          <QuestionResult key={i} number={i + 1} result={q} />
        ))}
      </>}
    </>
  );
}
