import {Button, Grid} from '@material-ui/core';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {NavLink} from 'react-router-dom';
import AdminBar from '../components/GameBoard/AdminBar';
import ArtificialPlayerList from '../components/GameBoard/ArtificialPlayerList';
import CurrentBlackCard from '../components/GameBoard/CurrentBlackCard';
import MessageBox from '../components/GameBoard/MessageBox';
import PlayedCards from '../components/GameBoard/PlayedCards';
import PlayerList from '../components/GameBoard/PlayerList';
import PlaySelection from '../components/GameBoard/PlaySelection/index';
import TopBar from '../components/GameBoard/TopBar';
import {StoreState} from '../store';

const gameAlertStyle = {
  display: 'block',
  width: 'auto',
  margin: '10px',
  fontSize: '1.5em'
};

const Game = () => {
  const {game, user} = useSelector(({game, global: {user}}: StoreState) => ({game, user}));

  return <div>
    {game ?
      <div>
        <TopBar/>
        {game.ownerId === user.id && <AdminBar/>}
        <Grid container spacing={0}>
          <Grid item xs={12} sm={5} md={4}>
            <CurrentBlackCard/>
            <PlayerList/>
            {(!!game.artificialPlayers.length || !!game.queuedArtificialPlayers.length)
              && <ArtificialPlayerList/>}
            <MessageBox/>
          </Grid>
          <Grid item xs={12} sm={7} md={8}>
            {game.hand && <PlaySelection/>}
            {
              game.queuedPlayers.map((user) => user.id).includes(user.id) &&
              <span
                className={'center panel'}
                style={gameAlertStyle}
              >
                Waiting until the next round to join game...
              </span>
            }
            <PlayedCards/>
            {
              game.judgeId === user.id &&
              <span
                className={'center panel'}
                style={gameAlertStyle}
              >
                You are the Judge
              </span>
            }
            {
              game.winner &&
              game.stage === 'notRunning' &&
              <span
                className={'center panel'}
                style={gameAlertStyle}
              >
                Winner: {game.winner.user ? game.winner.user.name : game.winner.artificialPlayerName}
              </span>
            }
          </Grid>
        </Grid>
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
  </div>;
};

export default Game;
