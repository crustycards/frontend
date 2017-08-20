import React from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

class CardpackViewer extends React.Component {
  constructor (props) {
    super(props);
    this.socket = this.props.socket;
    this.cardpackId = this.props.cardpackId;
    this.addCard = this.addCard.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.state = {
      currentUser: null,
      cards: [],
      newCardName: ''
    };
    axios.get('/api/currentuser')
    .then((response) => {
      let currentUser = response.data;
      this.setState({currentUser});
    });
    this.fetchCards();
  }

  handleInputChange (property, e) {
    let stateChange = {};
    stateChange[property] = e.target.value;
    this.setState(stateChange);
  }
  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.addCard();
    }
  }

  fetchCards () {
    if (this.cardpackId) {
      axios.get('/api/cards/' + this.cardpackId)
      .then((response) => {
        let cards = response.data;
        this.setState({cards});
      });
    }
  }

  addCard () {
    if (this.state.newCardName) {
      axios.post('/api/cards/' + this.cardpackId, {
        cardText: this.state.newCardName,
        cardType: 'white'
      });
      this.setState({newCardName: ''});
    }
  }
  removeCard (card) {
    axios.delete('/api/cards/' + card.id);
  }

  render () {
    let cardAdder = (<div>
      <TextField onKeyPress={this.handleKeyPress} floatingLabelText='Name' type='text' value={this.state.newCardName} onChange={this.handleInputChange.bind(this, 'newCardName')} /><br/>
      <RaisedButton label='Create Card' disabled={!this.state.newCardName} className='btn' onClick={this.addCard} />
    </div>);
    let cards = [];
    if (this.state.currentUser) {
      for (let i = 0; i < this.state.cards.length; i++) {
        cards.push(
          <Card className='card' key={i}>
            <CardHeader
              title={this.state.cards[i].text}
              subtitle={this.state.cards[i].type}
            />
            <CardActions>
              <FlatButton label='Delete' onClick={this.removeCard.bind(this, this.state.cards[i])} />
            </CardActions>
          </Card>
        );
      }
    } else {
      for (let i = 0; i < this.state.cards.length; i++) {
        cards.push(
          <Card className='card' key={i}>
            <CardHeader
              title={this.state.cards[i].text}
              subtitle={this.state.cards[i].type}
            />
          </Card>
        );
      }
    }
    /*<Card className='card'>
        <CardHeader
          title={this.props.user.firstname + ' ' + this.props.user.lastname}
          subtitle={this.props.user.email}
        />
        <CardActions>
          <FlatButton label='Unfriend' onClick={this.remove} />
        </CardActions>
      </Card>*/
    return (
      <div className='panel'>
        <div>Cardpack Editor</div>
        {this.state.currentUser ? cardAdder : null}
        {cards}
      </div>
    );
  }
}

export default CardpackViewer;