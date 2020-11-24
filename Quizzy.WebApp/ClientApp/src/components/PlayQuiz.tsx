import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import quizzesApi, { Quiz } from '../api/quizzesApi';
import { ErrorDisplay } from './ErrorDisplay';

export function PlayQuiz() {

    let { code } = useParams<{ code: string }>();

    const [errorMessage, setError] = useState<string>();
    const [quiz, setQuiz] = useState<Quiz>();

    useEffect(() => {
        const fetcher = async (qc: string) => await loadQuiz(qc);
        fetcher(code);
      }, [code]);
  
      async function loadQuiz(qc: string) : Promise<void> {
        //setIsLoading(true);
  
        const q = await quizzesApi.getQuiz(qc, (errMsg) => {setError(errMsg)});
        
        if (q)
            setQuiz(q);
        //setIsLoading(false);
      }

    return (
        <>
        <ErrorDisplay errorMessage={errorMessage} />
        <Container fluid={true}>Quiz {quiz?.name}</Container>
        </>
    );
}

