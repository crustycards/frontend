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
      newCardName: '',
      cardpack: undefined
    };
    axios.get('/api/currentuser')
    .then((response) => {
      let currentUser = response.data;
      this.setState({currentUser});
    });
    this.fetchCurrentCardpack();
    this.fetchCards();

    this.socket.on('cardcreate', (cardString) => {
      let card = JSON.parse(cardString).card;
      this.renderNewCard(card);
    });
    this.socket.on('carddelete', (cardString) => {
      let card = JSON.parse(cardString).card;
      this.unrenderOldCard(card);
    });
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

  renderNewCard (card) {
    this.setState({cards: [...this.state.cards, card]});
  }
  unrenderOldCard (card) {
    this.setState({cards: this.state.cards.filter((cardCurrent) => {
      return card.id !== cardCurrent.id;
    })});
  }

  fetchCurrentCardpack () {
    axios.get('/api/cardpacks/' + this.cardpackId)
    .then((response) => {
      let cardpack = response.data;
      this.setState({cardpack});
    })
    .catch(() => {
      this.setState({cardpack: null});
    });
  }
  fetchCards () {
    if (this.cardpackId) {
      axios.get('/api/cards/' + this.cardpackId)
      .then((response) => {
        let cards = response.data;
        this.setState({cards});
      })
      .catch((error) => {
        this.setState({cardpack: null});
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
    if (this.state.cardpack === null) {
      return (
        <div className='panel'>Cardpack does not exist</div>
      );
    }

    let isOwner = this.state.currentUser && this.state.cardpack && this.state.cardpack.owner && this.state.currentUser.id === this.state.cardpack.owner.id;
    let cardAdder = (<div>
      <TextField onKeyPress={this.handleKeyPress} floatingLabelText='Name' type='text' value={this.state.newCardName} onChange={this.handleInputChange.bind(this, 'newCardName')} /><br/>
      <RaisedButton label='Create Card' disabled={!this.state.newCardName} className='btn' onClick={this.addCard} />
    </div>);
    let cards = [];

    if (isOwner) {
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
    return (
      <div className='panel'>
        <div>{this.state.cardpack ? this.state.cardpack.name : 'Loading...'}</div>
        {isOwner ? cardAdder : null}
        {cards}
      </div>
    );
  }
}

export default CardpackViewer;