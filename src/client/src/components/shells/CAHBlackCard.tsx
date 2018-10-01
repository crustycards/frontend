import {Button, Card, CardActions, CardContent, Typography} from '@material-ui/core';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import * as React from 'react';
import {ApiContextWrapper} from '../../api/context';
import { BlackCard } from '../../api/dao';
import Api from '../../api/model/api';

const darkTheme = createMuiTheme({palette: {type: 'dark'}});

interface DisplayableBlackCard extends BlackCard {
  text: any; // TODO - Narrow down typing here (string | (string | Element)[])
}

interface CAHBlackCardProps {
  api: Api;
  card: DisplayableBlackCard;
  isOwner?: boolean;
  hideAnswerCount?: boolean;
  onDelete?(cardId: string): void;
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
