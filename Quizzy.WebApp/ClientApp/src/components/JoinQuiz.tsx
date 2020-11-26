import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { Button, FormGroup, Form, Label, Input, Alert } from 'reactstrap';

import quizzesApi from '../api/quizzesApi';

export function JoinQuiz() {

  const history = useHistory();

  const [code, setCode] = useState<string>("");
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [errorMsg, setErrorMessage] = useState<string>();

  const handleCodeChange = useCallback((e) => { 
      setCode(e.target.value); 
      if (e.target.value && e.target.value.toString().length === 8)
        setButtonEnabled(true);
      else
        setButtonEnabled(false);
    }, 
    []);

  const useCode = useCallback(async () => { 
    // TODO: Loading state
      let competition = await quizzesApi.getCompetition(code, e => {
        setErrorMessage(e);
      });

      if (competition?.status === "new")
        setErrorMessage("This quiz has not yet started.  Try again once the organiser has started it.");
      else if (competition?.status === "finished")
        setErrorMessage("This quiz has finished.");
      else if (competition) 
        history.push(`/quiz/${code}`);
    }, 
    [code, history]);

  return (
    <Form className="w-100 p-3 border border-secondary rounded">
      { errorMsg && <Alert color="danger">{errorMsg}</Alert>}
      <FormGroup>
        <Label for="join-code">Code</Label>
        <Input type="text" name="code" id="join-code" maxLength={8} value={code} placeholder="Enter 8 digit code" onChange={handleCodeChange} />
      </FormGroup>
      <FormGroup className="text-center">
        <Button disabled={!buttonEnabled} onClick={useCode} color="warning">Join a Quiz</Button>
      </FormGroup>
    </Form>
  );
}
