import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatButton, RaisedButton, Divider } from 'material-ui';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import CAHCard from '../components/CAHCard.jsx';
import PlayerList from '../components/GameBoard/PlayerList.jsx';
import Tray from '../components/GameBoard/Tray.jsx';
import { NavLink } from 'react-router-dom';
import { startGame, stopGame, leaveGame } from '../gameServerInterface';
import axios from 'axios';
const buttonStyle = {
  height: '36px',
  margin: '10px'
};

const Game = (props) => (
  <div>
    {props.game ?
      <div>
        <div className='game-top'>
          <h2>Current game: {props.game.name}</h2>
          <FlatButton label={'Start game'} onClick={startGame} style={buttonStyle} />
          <FlatButton label={'Stop game'} onClick={stopGame} style={buttonStyle} />
          <FlatButton label={'Leave game'} onClick={leaveGame} style={buttonStyle} />
        </div>
        <div className='game-main'>
          <div className='col-narrow'>
            {props.game.blackCard ? <CAHCard card={props.game.blackCard} /> : null}
            <PlayerList/>
          </div>
          <div className='col-wide'>
            <Tray/>
          </div>
        </div>
      </div>
      :
      <div className='content-wrap'>
        <div className='center panel'>You're not in a game. <NavLink to='/gamelist' style={{textDecoration: 'none'}}>
          <RaisedButton label='See Games' />
        </NavLink>
        </div>
      </div>
    }
  </div>
);

const mapStateToProps = ({game}) => ({game});

export default connect(mapStateToProps)(Game);
