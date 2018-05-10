import React, {Component} from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import { FlatButton } from 'material-ui';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { deleteBlackCard } from '../../apiInterface';

class CAHBlackCard extends Component {
  constructor (props) {
    super(props);

    this.removeCard = this.removeCard.bind(this);
  }

  removeCard() {
    return deleteBlackCard(this.props.card.id).then((data) => {
      if (this.props.onDelete) {
        this.props.onDelete(this.props.card.id);
      }
      return data;
    });
  }

  render() {
    return <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <Card className='card'>
        <CardHeader
          title={this.props.card.text}
          subtitle={this.props.card.answerFields}
        />
        <CardActions>
          {this.props.isOwner ? <FlatButton label='Delete' onClick={this.removeCard} /> : null}
        </CardActions>
      </Card>
    </MuiThemeProvider>;
  }
}

module.exports = CAHBlackCard;