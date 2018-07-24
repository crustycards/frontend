import React from 'react';
import {Card, CardActions, CardContent, Button, Typography} from '@material-ui/core';
import {ApiContextWrapper} from '../../api/context';

const CAHWhiteCard = (props) => {
  const removeCard = () => {
    return props.api.main.deleteWhiteCard(props.card.id).then((data) => {
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
        <Typography align={'left'} variant={'body1'}>
          {props.card.text}
        </Typography>
      </CardContent>
      <CardActions>
        {props.isOwner && props.onDelete && <Button onClick={removeCard}>Delete</Button>}
      </CardActions>
    </Card>
  );
};

module.exports = ApiContextWrapper(CAHWhiteCard);
