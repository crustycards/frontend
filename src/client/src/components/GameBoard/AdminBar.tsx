import {AppBar, Button, Theme, Toolbar, WithStyles, withStyles} from '@material-ui/core';
import * as React from 'react';
import {connect} from 'react-redux';
import {ApiContextWrapper} from '../../api/context';
import {GameData, User} from '../../api/dao';
import Api from '../../api/model/api';

const buttonStyle = {
  height: '36px',
  margin: '15px',
  width: 'auto',
  color: 'white'
};

const styles = (theme: Theme) => ({
  adminBar: {
    borderRadius: '5px',
    margin: '8px 0'
  }
});

interface AdminBarProps extends WithStyles<typeof styles> {
  api: Api;
  user: User;
  game: GameData;
}

const AdminBar = (props: AdminBarProps) => (
  <AppBar className={props.classes.adminBar} position={'static'}>
    <Toolbar style={{padding: 0}}>
      <h2
        style={{lineHeight: '66px', margin: '0 10px', fontSize: '1.2em'}}
      >
        {'Admin Panel'}
      </h2>
      <div style={{flex: 1}}></div> {/* Pushes buttons to right edge */}
      <div style={{float: 'right'}}>
        {
          props.game.ownerId === props.user.id &&
          <Button
            color={'secondary'}
            variant={'contained'}
            onClick={() => props.api.game.addArtificialPlayers(1)}
            style={buttonStyle}
          >
            Add Artificial Player
          </Button>
        }
        {
          props.game.ownerId === props.user.id &&
          <Button
            color={'secondary'}
            variant={'contained'}
            onClick={() => props.api.game.removeArtificialPlayers(1)}
            style={buttonStyle}
            disabled={!props.game.artificialPlayers.length && !props.game.queuedArtificialPlayers.length}
          >
            Remove Artificial Player
          </Button>
        }
        {
          props.game.ownerId === props.user.id &&
          props.game.stage === 'notRunning' &&
          <Button
            color={'secondary'}
            variant={'contained'}
            onClick={props.api.game.startGame}
            style={buttonStyle}
          >
            Start Game
          </Button>
        }
        {
          props.game.ownerId === props.user.id &&
          props.game.stage !== 'notRunning' &&
          <Button
            color={'secondary'}
            variant={'contained'}
            onClick={props.api.game.stopGame}
            style={buttonStyle}
          >
            Stop Game
          </Button>
        }
      </div>
    </Toolbar>
  </AppBar>
);

const StyledAdminBar = withStyles(styles)(AdminBar);

const ApiWrappedAdminBar = ApiContextWrapper(StyledAdminBar);

const mapStateToProps = ({game, global: {user}}: any) => ({game, user});

export default connect(mapStateToProps)(ApiWrappedAdminBar);
