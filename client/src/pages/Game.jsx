import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatButton, Divider } from 'material-ui';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import COHCard from '../components/COHCard.jsx';
import PlayerList from '../components/GameBoard/PlayerList.jsx';
import Tray from '../components/GameBoard/Tray.jsx';
import axios from 'axios';

// TODO - Redirect to game list if you are not in a game
const Game = (props) => (
  <div>
    {props.game.name ?
    <div>
      <div className='top-left' style={{width: '25%', height: '50%', float: 'left'}}>
        <COHCard card={props.game.currentBlackCard} />
      </div>
      <div className='top-right' style={{width: '75%', height: '50%', float: 'left'}}>
        <div>Current game: {props.game.name}</div>
        <FlatButton label={'Leave game'} onClick={console.log} />
      </div>
      <div className='bottom-left' style={{width: '25%', height: '50%', float: 'left'}}>
        <Divider/>
        <PlayerList/>
      </div>
      <div className='bottom-right' style={{width: '75%', height: '50%', float: 'left'}}>
        <Tray/>
      </div>
    </div>
    :
    <div>Not in a game</div>}
  </div>
);

const mapStateToProps = ({game}) => ({game});

export default connect(mapStateToProps)(Game);
