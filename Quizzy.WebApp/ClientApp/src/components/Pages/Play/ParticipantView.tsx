import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Participant } from '../../../api/participantTypes';
import { LiveParticipant } from './playTypes';


export function ParticipantView(props: { participants: LiveParticipant[], thisParticipant: Participant }) {
  const { participants, thisParticipant } = props;

  const me = participants.find(p => p.id === thisParticipant.id);

  return (
    <>
      <h3>Connected</h3>
      <ListGroup>
        {participants.filter(p => p.isConnected).map((p) => <ListGroupItem key={p.id}>{p.id === me?.id ? "*" : ""}{p.name} {p.answeredCurrent ? "Answered" : ""} {p.isConnected}</ListGroupItem>
        )}
      </ListGroup>
      <h3>Disconnected</h3>
      <ListGroup>
        {participants.filter(p => !p.isConnected).map((p) => <ListGroupItem key={p.id}>{p.id === me?.id ? "*" : ""}{p.name} {p.answeredCurrent ? "Answered" : ""} {p.isConnected}</ListGroupItem>
        )}
      </ListGroup>
    </>
  );
}
