import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CircularProgress,
  Theme
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import {makeStyles} from '@material-ui/styles';
import {push} from 'connected-react-router';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useApi} from '../../api/context';
import {StoreState} from '../../store';

const useStyles = makeStyles((theme: Theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  }
}));

const GameList = () => {
  const api = useApi();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const {game, games} = useSelector(({game, games}: StoreState) => ({game, games}));
  const classes = useStyles({});

  const refresh = () => {
    setIsLoading(true);
    api.game.getGameList().then(() => setIsLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  if (isLoading) {
    return <div>
      <h2>Games</h2>
      <div className='center'><CircularProgress size={80} thickness={5} /></div>
    </div>;
  }

  return (
    <div>
      <h2>Games</h2>
      <Button
        size={'small'}
        style={{marginBottom: '5px'}}
        onClick={refresh}
        variant={'contained'}
        color={'secondary'}
      >
        <RefreshIcon className={classes.leftIcon}/>
        Refresh
      </Button>
      {games.map((gameInfo, index) => (
        <Card
          style={
            game && game.name === gameInfo.name ?
              {filter: 'brightness(90%)'}
              :
              {}
          }
          key={index}
          className='card'
        >
          <CardHeader
            title={gameInfo.name}
            subheader={`Host: ${gameInfo.owner.name}`}
          />
          <CardActions>
            {
              game && game.name === gameInfo.name ?
                <Button onClick={() => {
                  api.game.leaveGame().then(refresh);
                }}>Leave</Button> :
                <Button onClick={() => {
                  api.game.joinGame(gameInfo.name).then(() => {
                    dispatch(push('/game'));
                  });
                }}>Join</Button>
            }
          </CardActions>
        </Card>
      ))}
      {
        games.length === 0 &&
        <div className='center'>
          <span>
            There are no open games to join
          </span>
        </div>
      }
    </div>
  );
};

export default GameList;
