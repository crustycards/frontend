import React, {Component} from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import { FlatButton } from 'material-ui';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { deleteBlackCard } from '../../apiInterface';

const CAHBlackCard = (props) => {
  const removeCard = () => {
    deleteBlackCard(props.card.id).then((data) => {
      if (props.onDelete) {
        props.onDelete(props.card.id);
      }
      return data;
    });
  };

  return <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <Card className='card'>
      <CardHeader
        title={props.card.text}
        subtitle={props.card.answerFields}
      />
      <CardActions>
        {props.isOwner ? <FlatButton label='Delete' onClick={removeCard} /> : null}
      </CardActions>
    </Card>
  </MuiThemeProvider>;
};

module.exports = CAHBlackCard;