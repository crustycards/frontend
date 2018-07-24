import React from 'react';
import {Card, CardActions, CardContent, Button, Typography} from '@material-ui/core';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {ApiContextWrapper} from '../../api/context';

const darkTheme = createMuiTheme({palette: {type: 'dark'}});

const CAHBlackCard = (props) => {
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

module.exports = ApiContextWrapper(CAHBlackCard);
