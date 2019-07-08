import {AppBar, Button, Theme, Toolbar, WithStyles, withStyles} from '@material-ui/core';
import * as React from 'react';
import {connect} from 'react-redux';
import {ApiContextWrapper} from '../../api/context';
import {GameData, User} from '../../api/dao';
import Api from '../../api/model/api';

const buttonStyle = {
  height: '36px',
  margin: '15px',
  width: 'auto'
};

const styles = (theme: Theme) => ({
  topBar: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '5px',
    margin: '8px 0'
  }
});

interface TopBarProps extends WithStyles<typeof styles> {
  api: Api;
  user: User;
  game: GameData;
}

const TopBar = (props: TopBarProps) => (
  <AppBar className={props.classes.topBar} position={'static'}>
    <Toolbar style={{padding: 0}}>
      <div style={{height: '66px', float: 'left'}}>
        <div>
          <h2
            style={{lineHeight: '36px', margin: '0 10px', fontSize: '1.2em'}}
          >
            {`Current game:  ${props.game.name}`}
          </h2>
        </div>
        <h3
          style={{float: 'left', lineHeight: '30px', margin: '0 10px', fontSize: '1em'}}
        >
          {`Owner: ${props.game.players.find((player) => player.id === props.game.ownerId).name}`}
        </h3>
      </div>
      <div style={{flex: 1}}></div> {/* Pushes buttons to right edge */}
      <div style={{float: 'right'}}>
        {
          props.game.stage === 'roundEndPhase' &&
          <Button
            color={'primary'}
            variant={'contained'}
            onClick={props.api.game.startNextRound}
            style={buttonStyle}
          >
            Start Next Round
          </Button>
        }
        <Button
          color={'primary'}
          variant={'contained'}
          onClick={props.api.game.leaveGame}
          style={buttonStyle}
        >
          Leave Game
        </Button>
      </div>
    </Toolbar>
  </AppBar>
);

const StyledTopBar = withStyles(styles)(TopBar);

const ApiWrappedTopBar = ApiContextWrapper(StyledTopBar);

const mapStateToProps = ({game, global: {user}}: any) => ({game, user});

export default connect(mapStateToProps)(ApiWrappedTopBar);
