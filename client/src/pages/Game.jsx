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

const Game = (props) => (
  <div>
    {props.game ?
      <div>
        {props.game.blackCard ? <CAHCard card={props.game.blackCard} /> : null}
        <div>Current game: {props.game.name}</div>
        <FlatButton label={'Start game'} onClick={startGame} />
        <FlatButton label={'Stop game'} onClick={stopGame} />
        <FlatButton label={'Leave game'} onClick={leaveGame} />
        <Divider/>
        <PlayerList/>
        <Tray/>
      </div>
      :
      <div className='content-wrap'>
        <div className="center panel">You're not in a game. <NavLink to='/gamelist' style={{textDecoration: 'none'}}>
          <RaisedButton label='See Games' />
        </NavLink>
        </div>
      </div>
    }
  </div>
);

const mapStateToProps = ({game}) => ({game});

export default connect(mapStateToProps)(Game);
