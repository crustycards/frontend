import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import COHCard from '../components/COHCard.jsx';
import Tray from '../components/GameBoard/Tray.jsx';
import axios from 'axios';

// TODO - Redirect to game list if you are not in a game
const Game = (props) => (
  <div>
    {props.game ?
    <div>
      <div>Current game: {props.name}</div>
      <FlatButton label={'Leave game'} onClick={console.log} />
      <Tray/>
    </div>
    :
    <div>Not in a game</div>}
  </div>
);

const mapStateToProps = ({global}) => (
  {
    game: global.currentGame
  }
);

export default connect(mapStateToProps)(Game);
