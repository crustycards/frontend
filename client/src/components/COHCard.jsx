import React, {Component} from 'react';
import { TextField, SelectField, RaisedButton, FlatButton, DropDownMenu, MenuItem } from 'material-ui';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import time from 'time-converter';
import cardpackFileHandler from '../helpers/cardpackFileHandler';
import fileSelect from 'file-select';
import axios from 'axios';

class COHCard extends Component {
  constructor (props) {
    super(props);
    this.removeCard = this.removeCard.bind(this);
  }

  removeCard (card) {
    axios.delete('/api/cards/' + this.props.card.id);
  }

  render () {
    let cardElements = [];
      cardElements.push(
        <CardHeader
          title={this.props.card.text + (this.props.card.answerFields && this.props.card.answerFields > 1 ? ' - ' + this.props.card.answerFields + ' card answer' : '')}
          subtitle={'Created ' + time.stringify(this.props.card.createdAt, {relativeTime: true})}
          key={0}
        />
      );

      if (this.props.isOwner) {
        cardElements.push(
          <CardActions key={1}>
            <FlatButton label='Delete' onClick={this.removeCard} />
          </CardActions>
        );
      }

      let cardWrapper = this.props.card.type === 'black' ? (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <Card className='card'>;
            {cardElements}
          </Card>
        </MuiThemeProvider>
      ) : (
        <Card className='card'>;
          {cardElements}
        </Card>
      );

      return cardWrapper;
  }
}

module.exports = COHCard;