import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Label, Input, Alert } from 'reactstrap';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Loader } from '../../General/Loader';
import { Competition } from '../../../api/competitionTypes';
import { Participant, ParticipantNew, createParticipantNew } from '../../../api/participantTypes';
import quizzesApi from '../../../api/quizzesApi';

const addPersonModalId: string = "personAddModal";

function CreateParticipant(props: { 
                            competition?: Competition,                             
                            onParticipantCreated: (participant: Participant) => void,
                            onCancel: () => void
                        }) {
    
    const { competition, onParticipantCreated, onCancel } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [newParticipant, setNewParticipant] = useState<ParticipantNew>(createParticipantNew());
    const [errorMessage, setError] = useState<string>();
  
    useEffect(() => {
      setNewParticipant(createParticipantNew());
      setError(undefined);
    }, []);

  const saveNewParticipant = useCallback(async () => {

      setIsLoading(true);
      
      const participantCreated = await quizzesApi.putParticipant(competition!.code, newParticipant, (errMsg) => {setError(errMsg)});

      if (participantCreated && onParticipantCreated) 
        onParticipantCreated(participantCreated);

      setIsLoading(false);
    },
    [competition, newParticipant, onParticipantCreated]
  );
  
  const toggleModal = useCallback(() => onCancel(), [onCancel]);
        
  const handleInputChange = useCallback(
    (e) => {        
      const target = e.target;
      setNewParticipant(prev => ({
        ...prev,
        [target.name]: target.value 
      }));
    },
    []
  );

  return (
    <>
    <Loader isLoading={isLoading} />
    <Modal isOpen={true} id={addPersonModalId} labelledBy="addParticipantModalLabel" aria-hidden="true">
      <ModalHeader aria-label="addParticipantModalLabel">Participant registration for "{competition?.quiz.name}"</ModalHeader>
      <ModalBody>
        <Alert color="info">Your results are tied to your email address so please enter carefully.</Alert>
        <Form>
          <ErrorDisplay errorMessage={errorMessage} />
          <FormGroup>
            <Label for="name">Your email</Label>
            <Input type="email" name="email" placeholder="Enter email" onChange={handleInputChange} />
          </FormGroup> 
          <FormGroup>
            <Label for="name">Display name (as others will see it)</Label>
            <Input type="text" name="name" placeholder="Enter name" onChange={handleInputChange} />
          </FormGroup>           
        </Form>
      </ModalBody>
      <ModalFooter>
          <Button color="primary" onClick={saveNewParticipant}>Join</Button>{' '}
          <Button color="secondary" data-dismiss="modal" onClick={toggleModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
    </>
  );
}

export { CreateParticipant };