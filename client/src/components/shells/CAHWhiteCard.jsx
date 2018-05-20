import React from 'react';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import { FlatButton } from 'material-ui';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { deleteWhiteCard } from '../../apiInterface';

const CAHWhiteCard = (props) => {
  const removeCard = () => {
    return deleteWhiteCard(props.card.id).then((data) => {
      if (props.onDelete) {
        props.onDelete(props.card.id);
      }
      return data;
    });
  };

  return <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    <Card className='card'>
      <CardHeader
        title={props.card.text}
      />
      <CardActions>
        {props.isOwner ? <FlatButton label='Delete' onClick={removeCard} /> : null}
      </CardActions>
    </Card>
  </MuiThemeProvider>;
};

module.exports = CAHWhiteCard;