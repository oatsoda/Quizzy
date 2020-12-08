import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Label, Input, Alert, InputGroupAddon, InputGroupText, InputGroup } from 'reactstrap';
import { ErrorDisplay } from '../../General/ErrorDisplay';
import { Loader } from '../../General/Loader';
import { Competition } from '../../../api/competitionTypes';
import { Participant, ParticipantNew, createParticipantNew } from '../../../api/participantTypes';
import quizzesApi from '../../../api/quizzesApi';
import { getStoredValue, storeValue } from '../../../storage/storageHelpers';
import { hasPropError, IValidationErrors } from "../../../api/validationTypes";
import { ParamError } from '../../General/ParamError';

const addPersonModalId: string = "personAddModal";

export function CreateParticipant(props: { 
                            competition?: Competition,                             
                            onParticipantCreated: (participant: Participant) => void,
                            onCancel: () => void
                        }) {
  
  const storageKey = "createParticipant";
  const { competition, onParticipantCreated, onCancel } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [newParticipant, setNewParticipant] = useState<ParticipantNew>(createParticipantNew());
  const [errorMessage, setError] = useState<string>();
  const [validationErrors, setValidationErrors] = useState<IValidationErrors>();

  useEffect(() => {      
    setNewParticipant(getStoredValue(storageKey, () => createParticipantNew()));
    setError(undefined);
  }, []);

  const saveNewParticipant = useCallback(async () => {

    setIsLoading(true);

    const participantCreated = await quizzesApi.putParticipant(competition!.code, newParticipant, setError, setValidationErrors);

    if (participantCreated && onParticipantCreated) {
      storeValue(storageKey, newParticipant);
      onParticipantCreated(participantCreated);
    }
    else {
      setIsLoading(false);
    }
  },
    [competition, newParticipant, onParticipantCreated]
  );
  
  const toggleModal = useCallback(() => onCancel(), [onCancel]);
        
  const handleInputChange = useCallback(
    (e) => {        
      const target = e.target;
      setNewParticipant((prev: ParticipantNew) => ({
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
            <InputGroup>
              <InputGroupAddon addonType="prepend" id="emailprepend">
                <InputGroupText>@</InputGroupText>
              </InputGroupAddon>
              <Input invalid={hasPropError(validationErrors, "email")} type="email" name="email" placeholder="Enter email" aria-describedby="emailprepend" onChange={handleInputChange} value={newParticipant.email} />
              <ParamError validationErrors={validationErrors} param="email" />
            </InputGroup>
          </FormGroup> 
          <FormGroup>
            <Label for="name">Display name (as others will see it)</Label>
            <Input invalid={hasPropError(validationErrors, "name")} type="text" name="name" placeholder="Enter name" onChange={handleInputChange} value={newParticipant.name} />
            <ParamError validationErrors={validationErrors} param="name" />
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

