import {Card, CardContent, Typography} from '@material-ui/core';
import * as React from 'react';
import {
  BlankWhiteCard
} from '../../../../../proto-gen-out/game/game_service_pb';

interface CAHBlankWhiteCardProps {
  card: BlankWhiteCard;
}

// TODO - Display fields from BlankWhiteCard other than text.
const CAHBlankWhiteCard = (props: CAHBlankWhiteCardProps) => {
  // TODO - Wrap in white theme

  return (
    <Card className='card'>
      <CardContent>
        <Typography align={'left'} variant={'body2'}>
          {props.card.getOpenText()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CAHBlankWhiteCard;
