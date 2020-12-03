import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Participant } from '../../../api/participantTypes';
import { LiveParticipant } from './playTypes';


export function ParticipantView(props: { participants: LiveParticipant[], thisParticipant: Participant }) {
  const { participants, thisParticipant } = props;

  function sorter(p1: LiveParticipant, p2: LiveParticipant) : number {
    if (p1.id === thisParticipant.id)
      return -1;
    if (p2.id === thisParticipant.id)
      return 1;
    if (p1.isConnected && !p2.isConnected)
      return -1;
    if (!p1.isConnected && p2.isConnected)
      return 1;

    return p1.name > p2.name 
      ? 1 
      : p1.name === p2.name
        ? 0
        : -1;
  }

  return (
    <>
      <ListGroup className="mb-3">
        {participants.sort(sorter).map((p) => <ParticipantViewItem key={p.id} participant={p} thisParticipantId={thisParticipant.id} />
        )}
      </ListGroup>
    </>
  );
}

function ParticipantViewItem(props: { participant: LiveParticipant, thisParticipantId: string }) {
  const { participant, thisParticipantId } = props;
  let className = !participant.isConnected 
                      ? "bg-light text-dark" 
                      : !participant.answeredCurrent 
                        ? "bg-secondary text-white"
                        : "bg-warning text-black";
  if (participant.id === thisParticipantId) className += " font-italic";
  let name = participant.name;
  if (!participant.isConnected) name += " (Offline)";
  return (
    <ListGroupItem className={className}>{name}</ListGroupItem>
  );
}
