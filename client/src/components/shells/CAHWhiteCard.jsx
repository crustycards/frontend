import React, {Component} from 'react';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import { FlatButton } from 'material-ui';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { deleteWhiteCard } from '../../apiInterface';

class CAHWhiteCard extends Component {
  constructor (props) {
    super(props);

    this.removeCard = this.removeCard.bind(this);
  }

  removeCard() {
    return deleteWhiteCard(this.props.card.id).then((data) => {
      if (this.props.onDelete) {
        this.props.onDelete(this.props.card.id);
      }
      return data;
    });
  }

  render() {
    return <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
      <Card className='card'>
        <CardHeader
          title={this.props.card.text}
        />
        <CardActions>
          {this.props.isOwner ? <FlatButton label='Delete' onClick={this.removeCard} /> : null}
        </CardActions>
      </Card>
    </MuiThemeProvider>;
  }
}

module.exports = CAHWhiteCard;