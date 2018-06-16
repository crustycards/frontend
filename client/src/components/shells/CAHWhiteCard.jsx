import React from 'react';
import { Card, CardActions, CardContent, Button } from '@material-ui/core';
import { deleteWhiteCard } from '../../apiInterface';

const CAHWhiteCard = (props) => {
  const removeCard = () => {
    return deleteWhiteCard(props.card.id).then((data) => {
      if (props.onDelete) {
        props.onDelete(props.card.id);
      }
      return data;
    });
  };

  // TODO - Wrap in white theme

  return (
    <Card className='card'>
      <CardContent>
        {props.card.text}
      </CardContent>
      <CardActions>
        {props.isOwner && props.onDelete && <Button onClick={removeCard}>Delete</Button>}
      </CardActions>
    </Card>
  );
};

module.exports = CAHWhiteCard;