import React from 'react';
import {connect} from 'react-redux';
import {Button} from '@material-ui/core';
import PlayerList from '../components/GameBoard/PlayerList.jsx';
import PlaySelection from '../components/GameBoard/PlaySelection/index.jsx';
import CurrentBlackCard from '../components/GameBoard/CurrentBlackCard.jsx';
import MessageBox from '../components/GameBoard/MessageBox.jsx';
import PlayedCards from '../components/GameBoard/PlayedCards.jsx';
import {NavLink} from 'react-router-dom';
import {startGame, stopGame, leaveGame, startNextRound} from '../gameServerInterface';

const buttonStyle = {
  height: '36px',
  margin: '10px'
};

const gameAlertStyle = {
  display: 'block',
  width: 'auto',
  margin: '10px',
  fontSize: '1.5em'
};

const Game = (props) => (
  <div>
    {props.game ?
      <div>
        <div className='game-top'>
          <h2>Current game: {props.game.name}</h2>
          <Button onClick={leaveGame} style={buttonStyle}>Leave Game</Button>
          {props.game.ownerId === props.currentUser.id && props.game.stage === 'notRunning' && <Button onClick={startGame} style={buttonStyle}>Start Game</Button>}
          {props.game.ownerId === props.currentUser.id && props.game.stage !== 'notRunning' && <Button onClick={stopGame} style={buttonStyle}>Stop Game</Button>}
          {props.game.stage === 'roundEndPhase' && <Button onClick={startNextRound} style={buttonStyle}>Start Next Round</Button>}
        </div>
        <div className='game-main'>
          <div className='col-narrow'>
            <CurrentBlackCard/>
            <PlayerList/>
            <MessageBox/>
          </div>
          <div className='col-wide'>
            {props.game.hand && <PlaySelection/>}
            {props.game.queuedPlayers.map((user) => user.id).includes(props.currentUser.id) && <span className={'center panel'} style={gameAlertStyle}>Waiting until the next round to join game...</span>}
            <PlayedCards/>
            {props.game.judgeId === props.currentUser.id && <span className={'center panel'} style={gameAlertStyle}>You are the Judge</span>}
            {props.game.winner && props.game.stage === 'notRunning' && <span className={'center panel'} style={gameAlertStyle}>Winner: {props.game.winner.name}</span>}
          </div>
        </div>
      </div>
      :
      <div className='content-wrap'>
        <div className='center panel'>You're not in a game.<NavLink to='/gamelist' style={{textDecoration: 'none'}}>
          <Button style={{marginLeft: '5px'}} variant={'outlined'} color={'primary'}>See Games</Button>
        </NavLink>
        </div>
      </div>
    }
  </div>
);

const mapStateToProps = ({game, user: {currentUser}}) => ({game, currentUser});

export default connect(mapStateToProps)(Game);
