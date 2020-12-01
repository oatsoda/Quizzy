import React from 'react';
import { useParams } from 'react-router-dom';

export function PageResults() {
  
    let { code, participantId } = useParams<{ code: string, participantId: string }>();

    return (
        <h1>Results {code} {participantId}</h1>
    );
}