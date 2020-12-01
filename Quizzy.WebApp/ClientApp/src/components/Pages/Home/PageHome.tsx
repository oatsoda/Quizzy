import React from 'react';
import { Container, Col, Row } from 'reactstrap';
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
    </Container>
    </>
  );
}

