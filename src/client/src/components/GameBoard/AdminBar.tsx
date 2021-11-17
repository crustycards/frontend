import {AppBar, Button, Toolbar, Typography} from '@mui/material';
import {makeStyles} from '@material-ui/styles';
import * as React from 'react';
import {GameView, Player} from '../../../../../proto-gen-out/crusty_cards_api/game_service_pb';
import {GameService} from '../../api/gameService';
import {User} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import UserListMenu from './UserListMenu';
import {filterPlayerListToUserList} from '../../helpers/proto';

const buttonStyle = {
  height: '36px',
  margin: '15px',
  width: 'auto',
  color: 'white'
};

const useStyles = makeStyles({
  adminBar: {
    margin: '8px 0'
  }
});

interface AdminBarProps {
  gameService: GameService;
  players: Player[];
  queuedPlayers: Player[];
  bannedUsers: User[];
  gameStage: GameView.Stage;
}

const AdminBar = (props: AdminBarProps) => {
  const classes = useStyles();

  const canStartGame = () => {
    const realPlayerCount = props.players.filter(
      (player) => player.hasUser()).length;
    const artificialPlayerCount =
      props.players.filter((player) => player.hasArtificialUser()).length;
    return realPlayerCount >= 2 && realPlayerCount + artificialPlayerCount >= 3;
  };

  return <AppBar className={classes.adminBar} position={'static'}>
    <Toolbar style={{padding: 0}}>
      <Typography style={{lineHeight: '66px', margin: '0 10px', fontSize: '1.2em'}}>
        {'Admin Panel'}
      </Typography>
      <div style={{flex: 1}}></div> {/* Pushes buttons to right edge */}
      <div style={{float: 'right'}}>
        <UserListMenu
          buttonText={'Kick'}
          buttonStyle={buttonStyle}
          users={filterPlayerListToUserList(props.players)}
          onUserSelect={(userName) => props.gameService.kickUser(userName)}
        />
        <UserListMenu
          buttonText={'Ban'}
          buttonStyle={buttonStyle}
          users={filterPlayerListToUserList(props.players)}
          onUserSelect={(userName) => props.gameService.banUser(userName)}
        />
        <UserListMenu
          buttonText={'Unban'}
          buttonStyle={buttonStyle}
          users={props.bannedUsers}
          onUserSelect={(userName) => props.gameService.unbanUser(userName)}
        />
        <Button
          color={'secondary'}
          variant={'contained'}
          onClick={() => props.gameService.addArtificialPlayer()}
          style={buttonStyle}
        >
          Add AI
        </Button>
        <Button
          color={'secondary'}
          variant={'contained'}
          onClick={() => props.gameService.removeArtificialPlayer()}
          style={buttonStyle}
          disabled={
            !props.players.filter(
              (player) => player.hasArtificialUser()).length &&
            !props.queuedPlayers.filter(
              (player) => player.hasArtificialUser()).length
          }
        >
          Remove AI
        </Button>
        {
          props.gameStage === GameView.Stage.NOT_RUNNING ?
          <Button
            color={'secondary'}
            variant={'contained'}
            onClick={props.gameService.startGame}
            style={buttonStyle}
            disabled={!canStartGame()}
          >
            Start Game
          </Button>
          :
          <Button
            color={'secondary'}
            variant={'contained'}
            onClick={props.gameService.stopGame}
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
