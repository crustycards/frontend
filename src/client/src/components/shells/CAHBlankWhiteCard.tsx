import {Card, CardContent, Typography} from '@mui/material';
import * as React from 'react';
import {
  BlankWhiteCard
} from '../../../../../proto-gen-out/crusty_cards_api/game_service_pb';

interface CAHBlankWhiteCardProps {
  card: BlankWhiteCard;
}

// TODO - Display fields from BlankWhiteCard other than text.
// TODO - Wrap in white theme
const CAHBlankWhiteCard = (props: CAHBlankWhiteCardProps) => (
  <Card>
    <CardContent>
      <Typography align={'left'} variant={'body2'}>
        {props.card.getOpenText()}
      </Typography>
    </CardContent>
  </Card>
);

export default CAHBlankWhiteCard;
