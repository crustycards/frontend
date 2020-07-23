import {Button, Card, CardActions, CardContent, Typography} from '@material-ui/core';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import * as React from 'react';
import {WhiteCard} from '../../../../../proto-gen-out/api/model_pb';
import {deleteWhiteCard} from '../../api/cardpackService';

const lightTheme = createMuiTheme({palette: {type: 'light'}});

interface CAHWhiteCardProps {
  card: WhiteCard;
  showDeleteButton?: boolean;
  onDelete?(cardId: string): void;
}

// TODO - Display fields from WhiteCard other than text.
const CAHWhiteCard = (props: CAHWhiteCardProps) => {
  const removeCard = () => {
    return deleteWhiteCard(props.card.getName()).then((data) => {
      if (props.onDelete) {
        props.onDelete(props.card.getName());
      }
    });
  };

  return (
    <MuiThemeProvider theme={lightTheme}>
      <Card className='card'>
        <CardContent>
          <Typography align={'left'} variant={'body2'}>
            {props.card.getText()}
          </Typography>
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

export default CAHWhiteCard;
