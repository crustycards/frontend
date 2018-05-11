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
  }

  render() {
    return <div><Tray cards={this.state.trayCards} /><PlayArea cards={this.state.playAreaCards} /></div>;
  }
}

const mapStateToProps = ({game}) => ({
  cards: game.hand
});

export default connect(mapStateToProps)(PlaySelection);