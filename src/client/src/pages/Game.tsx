import {Button} from '@material-ui/core';
import * as React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {ApiContextWrapper} from '../api/context';
import {GameData, User} from '../api/dao';
import Api from '../api/model/api';
import CurrentBlackCard from '../components/GameBoard/CurrentBlackCard';
import MessageBox from '../components/GameBoard/MessageBox';
import PlayedCards from '../components/GameBoard/PlayedCards';
import PlayerList from '../components/GameBoard/PlayerList';
import PlaySelection from '../components/GameBoard/PlaySelection/index';
import TopBar from '../components/GameBoard/TopBar';

const gameAlertStyle = {
  display: 'block',
  width: 'auto',
  margin: '10px',
  fontSize: '1.5em'
};

interface GameProps {
  game: GameData;
  user: User;
  api: Api;
}

const Game = (props: GameProps) => (
  <div>
    {props.game ?
      <div>
        <TopBar/>
        <div>
          <div className='col-narrow'>
            <CurrentBlackCard/>
            <PlayerList/>
            <MessageBox/>
          </div>
          <div className='col-wide'>
            {props.game.hand && <PlaySelection/>}
            {
              props.game.queuedPlayers.map((user) => user.id).includes(props.user.id) &&
              <span
                className={'center panel'}
                style={gameAlertStyle}
              >
                Waiting until the next round to join game...
              </span>
            }
            <PlayedCards/>
            {
              props.game.judgeId === props.user.id &&
              <span
                className={'center panel'}
                style={gameAlertStyle}
              >
                You are the Judge
              </span>
            }
            {
              props.game.winner &&
              props.game.stage === 'notRunning' &&
              <span
                className={'center panel'}
                style={gameAlertStyle}
              >
                Winner: {props.game.winner.name}
              </span>
            }
          </div>
        </div>
      </div>
      :
      <div className='content-wrap'>
        <div className='center panel'>
          {`You're not in a game.`}
          <NavLink
            to='/gamelist'
            style={{textDecoration: 'none'}}
          >
            <Button
              style={{marginLeft: '5px'}}
              variant={'outlined'}
              color={'primary'}
            >
              See Games
            </Button>
          </NavLink>
        </div>
      </div>
    }
  </div>
);

const ContextLinkedGame = ApiContextWrapper(Game);

const mapStateToProps = ({game, global: {user}}: any) => ({game, user});

export default connect(mapStateToProps)(ContextLinkedGame);
