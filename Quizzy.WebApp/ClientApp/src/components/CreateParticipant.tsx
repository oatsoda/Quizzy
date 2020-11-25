import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Label, Input } from 'reactstrap';
import { ErrorDisplay } from './ErrorDisplay';
import { Loader } from './Loader';
import { Competition, Participant, ParticipantNew, createParticipantNew } from '../api/Competition'
import quizzesApi from '../api/quizzesApi';

const addPersonModalId: string = "personAddModal";

function CreateParticipant(props: { 
                            visible: boolean,
                            competition?: Competition,                             
                            onParticipantCreated: (participant: Participant) => void,
                            onCancel: () => void
                        }) {
    
    const { visible, competition, onParticipantCreated, onCancel } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [newParticipant, setNewParticipant] = useState<ParticipantNew>(createParticipantNew());
    const [errorMessage, setError] = useState<string>();
  
    useEffect(() => {
        setNewParticipant(createParticipantNew());
        setError(undefined);
    }, [visible]);

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
    <Modal isOpen={visible} id={addPersonModalId} labelledBy="addParticipantModalLabel" aria-hidden="true">
      <ModalHeader aria-label="addParticipantModalLabel">Join Quiz: "{competition?.quiz.name}"</ModalHeader>
      <ModalBody>
        <Form>
          <ErrorDisplay errorMessage={errorMessage} />
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" placeholder="Enter name" onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="email" name="email" placeholder="Enter email" onChange={handleInputChange} />
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