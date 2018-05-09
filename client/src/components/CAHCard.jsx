import React, {Component} from 'react';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import { FlatButton } from 'material-ui';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import api from '../apiInterface';

class CAHCard extends Component {
  constructor (props) {
    super(props);

    this.removeCard = this.removeCard.bind(this);

    // If we have no playhandler register console.error to 
    // report the error if invoked
    this.playHandler = (this.props.playHandler || console.error).bind(this);
  }

  removeCard() {
    return api.deleteCard(this.props.card.id);
  }

  render() {
    return <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
      <Card className='card'>
        <CardHeader
          title={this.props.card.text + (this.props.card.answerFields && this.props.card.answerFields > 1 ? ' - ' + this.props.card.answerFields + ' card answer' : '')}
          key={0}
        />
        <CardActions key={1}>
          {this.props.isOwner ? <FlatButton label='Delete' onClick={this.removeCard} /> : null}
          {this.props.playHandler ? <FlatButton label='Play' onClick={() => this.playHandler(this.props.card)} /> : null}
        </CardActions>
      </Card>
    </MuiThemeProvider>;
  }
}

module.exports = CAHCard;