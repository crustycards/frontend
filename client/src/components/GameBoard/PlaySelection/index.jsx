import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tray from './Tray.jsx';
import PlayArea from './PlayArea.jsx';

class PlaySelection extends Component {
  constructor (props) {
    super(props);

    this.state = {
      trayCards: props.cards,
      playAreaCards: []
    };

    this.moveCardToTray = this.moveCardToTray.bind(this);
    this.moveCardToPlayQueue = this.moveCardToPlayQueue.bind(this);
  }

  moveCardToTray(cardId) {
    const card = this.state.playAreaCards.find(card => card.id === cardId);
    this.setState({trayCards: [...this.state.trayCards, card], playAreaCards: this.state.playAreaCards.filter(card => card.id !== cardId)});
  }

  moveCardToPlayQueue(cardId) {
    const card = this.state.trayCards.find(card => card.id === cardId);
    this.setState({playAreaCards: [...this.state.playAreaCards, card], trayCards: this.state.trayCards.filter(card => card.id !== cardId)});
  }

  render() {
    return <div>
      <Tray onMove={this.moveCardToPlayQueue} cards={this.state.trayCards} />
      <PlayArea onMove={this.moveCardToTray} cards={this.state.playAreaCards} />
    </div>;
  }
}

const mapStateToProps = ({game}) => ({
  cards: game.hand
});

export default connect(mapStateToProps)(PlaySelection);