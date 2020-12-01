import React from 'react';
import { useParams } from 'react-router-dom';
import { MenuBar } from '../../Nav/MenuBar';

export function PageResults() {
  
  let { code, participantId } = useParams<{ code: string, participantId: string }>();

  return (
    <>
      <MenuBar />
      <h1>Results {code} {participantId}</h1>
    </>
  );
}