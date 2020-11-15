import {Button, Grid, Typography} from '@material-ui/core';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {NavLink} from 'react-router-dom';
import AdminBar from '../components/GameBoard/AdminBar';
import CurrentBlackCard from '../components/GameBoard/CurrentBlackCard';
import MessageBox from '../components/GameBoard/MessageBox';
import PlayedCards from '../components/GameBoard/PlayedCards';
import PlayerList from '../components/GameBoard/PlayerList';
import PlaySelection from '../components/GameBoard/PlaySelection/index';
import TopBar from '../components/GameBoard/TopBar';
import {StoreState} from '../store';
import {useGameService} from '../api/context';
import {filterPlayerListToUserList} from '../helpers/proto';
import {useGlobalStyles} from '../styles/globalStyles';

const GamePage = () => {
  const {
    game,
    currentUser
  } = useSelector(({game, global: {user}}: StoreState) => ({
    game,
    currentUser: user
  }));
  const gameService = useGameService();

  const globalClasses = useGlobalStyles();

  if (!gameService || !currentUser) {
    // TODO - Redirect to login page (if this doesn't happen already).
    return (
      <div className={globalClasses.contentWrap}>
        <div className={`${globalClasses.center} ${globalClasses.panel}`}>
          {`You must be logged in to join a game.`}
        </div>
      </div>
    );
  }

  if (!game.view) {
    return (
      <div>
        <div className={globalClasses.center} style={{padding: '10px'}}>
          <Typography variant={'h6'} align={'center'}>
            You're not in a game.
          </Typography>
          <NavLink
            to='/gamelist'
            style={{textDecoration: 'none'}}
          >
            <Button
              style={{margin: '5px'}}
              variant={'outlined'}
              color={'primary'}
            >
              See Games
            </Button>
          </NavLink>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.getName() === game.view.getOwner()?.getName();

  return (
    <div>
      <div>
        <TopBar
          gameService={gameService}
          pastRounds={game.view.getPastRoundsList()}
          displayName={
            game.view.getConfig()?.getDisplayName() || 'Unknown Game'
          }
          owner={game.view.getOwner()}
          gameStage={game.view.getStage()}
        />
        {
          isOwner &&
            <AdminBar
              gameService={gameService}
              players={game.view.getPlayersList()}
              queuedPlayers={game.view.getQueuedPlayersList()}
              bannedUsers={game.view.getBannedUsersList()}
              gameStage={game.view.getStage()}
            />
        }
        <Grid container spacing={0}>
          <Grid item xs={12} sm={5} md={4}>
            <CurrentBlackCard
              currentBlackCard={game.view.getCurrentBlackCard()}
              hand={game.view.getHandList()}
              queuedCardIds={game.queuedCardIds}
            />
            <PlayerList gameView={game.view}/>
            <MessageBox
              gameService={gameService}
              messages={game.view.getChatMessagesList().reverse()}
            />
          </Grid>
          <Grid item xs={12} sm={7} md={8}>
            {
              !!game.view.getHandList().length &&
                <PlaySelection
                  gameService={gameService}
                  currentUser={currentUser}
                  gameView={game.view}
                  queuedCardIds={game.queuedCardIds}
                />
            }
            {
              game.view.getJudge()?.getName() === currentUser.getName() &&
                <Typography
                  variant={'h5'}
                  className={`${globalClasses.center} ${globalClasses.panel}`}
                >
                  You are the Judge
                </Typography>
            }
            {
              filterPlayerListToUserList(game.view.getQueuedPlayersList())
                .map((user) => user.getName())
                .includes(currentUser.getName()) &&
                  <Typography
                    variant={'h5'}
                    className={`${globalClasses.center} ${globalClasses.panel}`}
                  >
                    Waiting until the next round to join game...
                  </Typography>
            }
            <PlayedCards
              gameService={gameService}
              gameWinner={game.view.getWinner()}
              currentUser={currentUser}
              judge={game.view.getJudge()}
              gameStage={game.view.getStage()}
              whitePlayedList={game.view.getWhitePlayedList()}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default GamePage;
