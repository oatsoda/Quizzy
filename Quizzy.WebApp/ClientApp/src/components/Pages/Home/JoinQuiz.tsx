import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { Button, FormGroup, Form, Input, Alert } from 'reactstrap';

import quizzesApi from '../../../api/quizzesApi';
import paths from '../../Config/paths';

export function JoinQuiz() {

  const history = useHistory();

  const [code, setCode] = useState<string>("");
  const [state, setState] = useState<JoinQuizState>({ buttonEnabled: false, loading: false });

  const handleCodeChange = useCallback((e) => { 
      setCode(e.target.value); 
      if (e.target.value && e.target.value.toString().length === 8)
        setState({ buttonEnabled: true, loading: false });
      else
        setState({ buttonEnabled: false, loading: false });
    }, 
    []);

  const handleButtonClick = useCallback(async () => {      
      setState({ buttonEnabled: false, loading: true });
      let competition = await quizzesApi.getCompetition(code, e => {
        setState({ buttonEnabled: true, loading: false, errorMessage: e });
      });

      if (competition?.status === "new")
        setState({ buttonEnabled: true, loading: false, errorMessage: "This quiz has not yet started.  Try again once the organiser has started it." });
      else if (competition?.status === "finished")
        setState({ buttonEnabled: true, loading: false, errorMessage: "This quiz has finished." });
      else if (competition) 
        history.push(paths.PlayCompetition(code));
    }, 
    [code, history]);

  return (
    <Form className="w-100 p-3 border border-secondary rounded">
      { state.errorMessage && <Alert color="danger">{state.errorMessage}</Alert>}
      <FormGroup>
        <Input type="text" name="code" id="join-code" maxLength={8} value={code} placeholder="Enter 8 digit code" onChange={handleCodeChange} />
      </FormGroup>
      <FormGroup className="text-center mb-0">
        <Button disabled={!state.buttonEnabled} onClick={handleButtonClick} color="warning">
          { state.loading && <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span> }
          Join a Quiz
        </Button>
      </FormGroup>
    </Form>
  );
}
type JoinQuizState = {
  buttonEnabled: boolean, 
  loading: boolean, 
  errorMessage?: string
}
