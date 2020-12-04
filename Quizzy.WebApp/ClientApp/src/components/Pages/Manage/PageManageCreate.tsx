import React from 'react';
import { Container } from 'reactstrap';
import { MenuBar } from '../../Nav/MenuBar';
import { CreateQuiz } from './CreateQuiz';

export function PageManageCreate() {
  
  return (
    <>
      <MenuBar />
      <Container>
        <h1>Start or Build a new Quiz</h1>
        <CreateQuiz />
      </Container>
    </>
  );
}