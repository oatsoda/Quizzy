import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import { MenuBar } from '../../Nav/MenuBar';

export function PageManageEdit() {
  
  let { id } = useParams<{ id: string }>();

  return (
    <>
      <MenuBar />
      <Container>
        <h1>Quiz {id}</h1>
      </Container>
    </>
  );
}