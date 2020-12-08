import React from 'react';
import { Badge, ListGroupItem } from 'reactstrap';
import { CompetitionOutcomeLeader } from '../../../api/competitionTypes';


export function LeaderboardResult(props: { participant: CompetitionOutcomeLeader; totalQuestions: number; position: 1 | 2 | 3; }) {
  const { participant, totalQuestions, position } = props;

  let classes = `display-${position + 3} d-flex justify-content-between align-items-center`;
  if (position === 1)
    classes += " bg-success text-white";
  else if (position === 2)
    classes += " bg-wrong";

  return (
    <ListGroupItem className={classes}>{position}. {participant.name} <Badge pill color="primary">{participant.correctAnswers} of {totalQuestions}</Badge></ListGroupItem>
  );
}
