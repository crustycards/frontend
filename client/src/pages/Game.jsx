import React from 'react';
import { connect } from 'react-redux';
import { FlatButton, RaisedButton, Divider } from 'material-ui';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import CAHBlackCard from '../components/shells/CAHBlackCard.jsx';
import PlayerList from '../components/GameBoard/PlayerList.jsx';
import PlaySelection from '../components/GameBoard/PlaySelection/index.jsx';
import CurrentBlackCard from '../components/GameBoard/CurrentBlackCard.jsx';
import MessageBox from '../components/GameBoard/MessageBox.jsx';
import { NavLink } from 'react-router-dom';
import { startGame, stopGame, leaveGame } from '../gameServerInterface';

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
            <CurrentBlackCard/>
            <PlayerList/>
            <MessageBox/>
          </div>
          <div className='col-wide'>
            <PlaySelection/>
          </div>
        </div>
      </div>
      :
      <div className='content-wrap'>
        <div className='center panel'>You're not in a game.<NavLink to='/gamelist' style={{textDecoration: 'none'}}>
          <RaisedButton label='See Games' />
        </NavLink>
        </div>
      </div>
    }
  </div>
);

const mapStateToProps = ({game}) => ({game});

export default connect(mapStateToProps)(Game);
