import React from 'react';
import { Container, Col, Row, ListGroup, ListGroupItem } from 'reactstrap';
import { CreateQuizLink } from './CreateQuizLink';
import { HomeBanner } from './HomeBanner';
import { JoinQuiz } from './JoinQuiz';

export function PageHome() {
  return (
    <>
    <HomeBanner />
    <Container>
      <Row className="mb-3">
        <Col md={{ size: 4, offset: 4 }} className="d-flex justify-content-center">
          <CreateQuizLink />
        </Col>
      </Row>
      <Row>
        <Col md={{ size: 4, offset: 4 }} className="d-flex justify-content-center">
          <JoinQuiz />
        </Col>
      </Row>
      <h1 className="display-4 mt-5">How it works</h1>
      <ListGroup>        
        <ListGroupItem>1. Create a quiz with questions of your own.</ListGroupItem>
        <ListGroupItem>2. Get your participants together on a video call and give them the code.</ListGroupItem>
        <ListGroupItem>3. Once everyone is ready, start the quiz.</ListGroupItem>
        <ListGroupItem>4. Participants use their own web browser to see and answer the questions.</ListGroupItem>
        <ListGroupItem>5. Everyone can see who is connected and when they have answered each question.</ListGroupItem>
      </ListGroup>
    </Container>
    </>
  );
}

