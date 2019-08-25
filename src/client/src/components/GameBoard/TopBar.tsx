import {AppBar, Button, Theme, Toolbar} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import {push} from 'connected-react-router';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {useApi} from '../../api/context';
import {StoreState} from '../../store';

const buttonStyle = {
  height: '36px',
  margin: '15px',
  width: 'auto'
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  topBar: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '5px',
    margin: '8px 0'
  }
}));

const TopBar = () => {
  const api = useApi();
  const {game} = useSelector(({game}: StoreState) => ({game}));
  const classes = useStyles({});
  const dispatch = useDispatch();

  return <AppBar className={classes.topBar} position={'static'}>
    <Toolbar style={{padding: 0}}>
      <div style={{height: '66px', float: 'left'}}>
        <div>
          <h2
            style={{lineHeight: '36px', margin: '0 10px', fontSize: '1.2em'}}
          >
            {`Current game:  ${game.name}`}
          </h2>
        </div>
        <h3
          style={{float: 'left', lineHeight: '30px', margin: '0 10px', fontSize: '1em'}}
        >
          {`Owner: ${game.players.find((player) => player.id === game.ownerId).name}`}
        </h3>
      </div>
      <div style={{flex: 1}}></div> {/* Pushes buttons to right edge */}
      <div style={{float: 'right'}}>
        {
          game.stage === 'roundEndPhase' &&
          <Button
            color={'primary'}
            variant={'contained'}
            onClick={api.game.startNextRound}
            style={buttonStyle}
          >
            Next Round
          </Button>
        }
        <Button
          color={'primary'}
          variant={'contained'}
          onClick={() => {
            api.game.leaveGame().then(() => dispatch(push('/gamelist')));
          }}
          style={buttonStyle}
        >
          Leave Game
        </Button>
      </div>
    </Toolbar>
  </AppBar>;
};

export default TopBar;
