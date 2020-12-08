import React, { useCallback, useEffect, useState } from 'react';
import { ListGroup } from 'reactstrap';
import { Competition, CompetitionOutcome } from '../../../api/competitionTypes';
import quizzesApi from '../../../api/quizzesApi';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Loader } from '../../General/Loader';
import { LeaderboardResult } from './LeaderboardResult';


export function CompetitionResults(props: { code: string; onLoaded: () => void; }) {
  const { code, onLoaded } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setError] = useState<string>();
  const [competition, setCompetition] = useState<Competition>();

  const loadCompetition = useCallback(
    async (c: string): Promise<void> => {
      const result = await quizzesApi.getCompetition(c, setError);
      if (result)
        setCompetition(result);

      onLoaded();
      setIsLoading(false);
    },
    [onLoaded]
  );

  useEffect(() => {
    const fetcher = async (c: string) => await loadCompetition(c);
    fetcher(code);
  },
    [code, loadCompetition]
  );

  function displayResults(outcome?: CompetitionOutcome) {
    if (!outcome)
      return;

    return (
      <ListGroup>
        <LeaderboardResult participant={outcome.first} totalQuestions={outcome.totalQuestions} position={1} />
        {outcome.second && <LeaderboardResult participant={outcome.second} totalQuestions={outcome.totalQuestions} position={2} />}
        {outcome.third && <LeaderboardResult participant={outcome.third} totalQuestions={outcome.totalQuestions} position={3} />}
      </ListGroup>
    );
  }

  return (
    <>
      <div className="mb-5">
        <Loader isLoading={isLoading} />
        <ErrorDisplay errorMessage={errorMessage} />
        <h2 className="mb-3">Competition Results {competition && <span className="text-muted"> for {competition.quiz.name}</span>}</h2>
        {displayResults(competition?.outcome)}
      </div>
    </>
  );
}
