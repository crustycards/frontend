import {Button, Card, CardActions, CardContent, Typography} from '@material-ui/core';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import * as React from 'react';
import {BlackCard} from '../../../../../proto-gen-out/api/model_pb';
import {deleteBlackCard} from '../../api/cardpackService';

const darkTheme = createMuiTheme({palette: {type: 'dark'}});

interface CAHBlackCardProps {
  card: BlackCard;
  showDeleteButton?: boolean;
  hideAnswerCount?: boolean;
  overrideTextElements?: (string | JSX.Element)[];
  onDelete?(cardId: string): void;
}

// TODO - Display fields from WhiteCard other than text and answerFields.
const CAHBlackCard = (props: CAHBlackCardProps) => {
  const removeCard = () => {
    deleteBlackCard(props.card.getName()).then((data) => {
      if (props.onDelete) {
        props.onDelete(props.card.getName());
      }
    });
  };

  return (
    <MuiThemeProvider theme={darkTheme}>
      <Card className='card'>
        <CardContent>
          <Typography align={'left'} gutterBottom variant={'h6'}>
            {props.overrideTextElements || props.card.getText()}
          </Typography>
          {
            !props.hideAnswerCount &&
            <Typography
              align={'left'}
              color={'textSecondary'}
              variant={'body1'}
            >
              {`Answers: ${props.card.getAnswerFields()}`}
            </Typography>
          }
        </CardContent>
        <CardActions>
          {
            props.showDeleteButton &&
              <Button onClick={removeCard}>Delete</Button>
          }
        </CardActions>
      </Card>
    </MuiThemeProvider>
  );
};

export default CAHBlackCard;
