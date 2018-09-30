import * as React from 'react';
import {Card, CardActions, CardContent, Button, Typography} from '@material-ui/core';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {ApiContextWrapper} from '../../api/context';
import Api from '../../api/model/api';
import { BlackCard } from '../../api/dao';

const darkTheme = createMuiTheme({palette: {type: 'dark'}});

interface DisplayableBlackCard extends BlackCard {
  text: any // TODO - Narrow down typing here (string | (string | Element)[])
}

interface CAHBlackCardProps {
  api: Api
  card: DisplayableBlackCard
  isOwner?: boolean
  onDelete?(cardId: string): void
  hideAnswerCount?: boolean
}

const CAHBlackCard = (props: CAHBlackCardProps) => {
  const removeCard = () => {
    props.api.main.deleteBlackCard(props.card.id).then((data) => {
      if (props.onDelete) {
        props.onDelete(props.card.id);
      }
      return data;
    });
  };

  return <MuiThemeProvider theme={darkTheme}>
    <Card className='card'>
      <CardContent>
        <Typography align={'left'} gutterBottom variant={'title'}>
          {props.card.text}
        </Typography>
        {
          !props.hideAnswerCount &&
          <Typography align={'left'} color={'textSecondary'} variant={'subheading'}>
            {`Answers: ${props.card.answerFields}`}
          </Typography>
        }
      </CardContent>
      <CardActions>
        {props.isOwner && <Button onClick={removeCard}>Delete</Button>}
      </CardActions>
    </Card>
  </MuiThemeProvider>;
};

export default ApiContextWrapper(CAHBlackCard);
