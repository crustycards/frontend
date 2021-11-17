import {Card, CardContent, Typography} from '@mui/material';
import * as React from 'react';
import {
  BlankWhiteCard
} from '../../../../../proto-gen-out/crusty_cards_api/game_service_pb';
import {useGlobalStyles} from '../../styles/globalStyles';

interface CAHBlankWhiteCardProps {
  card: BlankWhiteCard;
}

// TODO - Display fields from BlankWhiteCard other than text.
const CAHBlankWhiteCard = (props: CAHBlankWhiteCardProps) => {
  // TODO - Wrap in white theme

  const globalClasses = useGlobalStyles();

  return (
    <Card className={globalClasses.card}>
      <CardContent>
        <Typography align={'left'} variant={'body2'}>
          {props.card.getOpenText()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CAHBlankWhiteCard;
