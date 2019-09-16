import {AppBar, Button, Toolbar} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {useApi} from '../../api/context';
import {StoreState} from '../../store';
import {PlayerBanMenu, PlayerKickMenu, PlayerUnbanMenu} from './PlayerManagementMenus';

const buttonStyle = {
  height: '36px',
  margin: '15px',
  width: 'auto',
  color: 'white'
};

const useStyles = makeStyles({
  adminBar: {
    borderRadius: '5px',
    margin: '8px 0'
  }
});

const AdminBar = () => {
  const api = useApi();
  const classes = useStyles({});
  const {game} = useSelector(({game}: StoreState) => ({game}));

  const canStartGame = () => {
    if (game.players.length < 2) {
      return false;
    } else if (game.players.length + game.artificialPlayers.length < 3) {
      return false;
    } else {
      return true;
    }
  };

  return <AppBar className={classes.adminBar} position={'static'}>
    <Toolbar style={{padding: 0}}>
      <h2
        style={{lineHeight: '66px', margin: '0 10px', fontSize: '1.2em'}}
      >
        {'Admin Panel'}
      </h2>
      <div style={{flex: 1}}></div> {/* Pushes buttons to right edge */}
      <div style={{float: 'right'}}>
        <PlayerKickMenu buttonStyle={buttonStyle}/>
        <PlayerBanMenu buttonStyle={buttonStyle}/>
        <PlayerUnbanMenu buttonStyle={buttonStyle}/>
        <Button
          color={'secondary'}
          variant={'contained'}
          onClick={() => api.game.addArtificialPlayers(1)}
          style={buttonStyle}
        >
          Add AI
        </Button>
        <Button
          color={'secondary'}
          variant={'contained'}
          onClick={() => api.game.removeArtificialPlayers(1)}
          style={buttonStyle}
          disabled={!game.artificialPlayers.length && !game.queuedArtificialPlayers.length}
        >
          Remove AI
        </Button>
        {
          game.stage === 'notRunning' ?
          <Button
            color={'secondary'}
            variant={'contained'}
            onClick={api.game.startGame}
            style={buttonStyle}
            disabled={!canStartGame()}
          >
            Start Game
          </Button>
          :
          <Button
            color={'secondary'}
            variant={'contained'}
            onClick={api.game.stopGame}
            style={buttonStyle}
          >
            Stop Game
          </Button>
        }
      </div>
    </Toolbar>
  </AppBar>;
};

export default AdminBar;
