import React from 'react';
import { Button, FormGroup, Form } from 'reactstrap';

export function CreateQuizLink() {
  return (
    <Form className="w-100 p-3 border border-secondary rounded">
      <FormGroup className="text-center mb-0">
        <Button color="primary">Create a Quiz</Button>
      </FormGroup>
    </Form>
  );
}
