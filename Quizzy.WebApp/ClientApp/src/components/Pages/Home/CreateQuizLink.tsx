import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, FormGroup, Form } from 'reactstrap';
import paths from '../../Config/paths';

export function CreateQuizLink() {

  const history = useHistory();

  const handleButtonClick = useCallback(async () => {  
       
    history.push(paths.CreateQuiz);
  }, 
  [history]);

  return (
    <Form className="w-100 p-3 border border-secondary rounded">
      <FormGroup className="text-center mb-0">
        <Button color="primary" onClick={handleButtonClick}>Create a Quiz</Button>
      </FormGroup>
    </Form>
  );
}
