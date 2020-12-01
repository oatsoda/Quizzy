import React from 'react';
import { Container, Jumbotron } from 'reactstrap';


export function HomeBanner() {
  return (
    <Jumbotron fluid={true} className="bg-dark text-white">
      <Container>          
        <h1 className="display-4">Quizzy</h1>
        <p className="lead">Create and play interactive quizzes with family and friends.</p>
      </Container>
    </Jumbotron>
  );
}
