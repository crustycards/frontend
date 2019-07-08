import {Button, Card, CardActions, CardContent, Typography} from '@material-ui/core';
import * as React from 'react';
import {ApiContextWrapper} from '../../api/context';
import { WhiteCard } from '../../api/dao';
import Api from '../../api/model/api';

interface CAHWhiteCardProps {
  api: Api;
  card: WhiteCard;
  isOwner?: boolean;
  onDelete?(cardId: string): void;
}

const CAHWhiteCard = (props: CAHWhiteCardProps) => {
  const removeCard = () => {
    return props.api.main.deleteWhiteCard(props.card.cardpackId, props.card.id).then((data) => {
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
        <Typography align={'left'} variant={'body2'}>
          {props.card.text}
        </Typography>
      </CardContent>
      <CardActions>
        {props.isOwner && props.onDelete && <Button onClick={removeCard}>Delete</Button>}
      </CardActions>
    </Card>
  );
};

export default ApiContextWrapper(CAHWhiteCard);
