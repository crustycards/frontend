import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Theme,
  Typography,
  Grid,
  TextField
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import {makeStyles} from '@material-ui/styles';
import {push} from 'connected-react-router';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {convertTime} from '../../helpers/time';
import {StoreState} from '../../store';
import {GameService} from '../../api/gameService';
import {SearchGamesRequest, GameInfo} from '../../../../../proto-gen-out/game/game_service_pb';
import NumberBoundTextField from '../NumberBoundTextField';
import {useGlobalStyles} from '../../styles/globalStyles';

const useStyles = makeStyles((theme: Theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  gameListHeader: {
    padding: theme.spacing(1)
  }
}));

interface GameListProps {
  gameService: GameService
};

const GameList = (props: GameListProps) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {game} = useSelector(({game}: StoreState) => ({game}));
  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  const [games, setGames] = useState<GameInfo[]>([]);

  // Fields for searching games.
  const [query, setQuery] = useState('');
  const [minAvailablePlayerSlots, setMinAvailablePlayerSlots] = useState(0);
  const [gameStageFilter, setGameStageFilter] = useState(
    SearchGamesRequest.GameStageFilter.FILTER_NONE);

  const refresh = () => {
    if (!isLoading) {
      setIsLoading(true);
      const searchGamesRequest = new SearchGamesRequest();
      searchGamesRequest.setQuery(query);
      searchGamesRequest.setMinAvailablePlayerSlots(minAvailablePlayerSlots);
      searchGamesRequest.setGameStageFilter(gameStageFilter);
      props.gameService.searchGames(searchGamesRequest).then((games) => {
        setGames(games);
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  if (isLoading) {
    return <div>
      <Typography
        className={classes.gameListHeader}
        variant={'h4'}
        color={'textPrimary'}
        align={'center'}
      >
        Games
      </Typography>
      <div className='center'><CircularProgress size={80} thickness={5} /></div>
    </div>;
  }

  return (
    <div>
      <Typography
        className={classes.gameListHeader}
        variant={'h4'}
        color={'textPrimary'}
        align={'center'}
      >
        Games
      </Typography>
      {games.map((gameInfo, index) => (
        <Card
          style={
            game.view?.getGameId() === gameInfo.getGameId() ?
              {filter: 'brightness(90%)'}
              :
              {}
          }
          key={index}
          className='card'
        >
          <CardHeader
            title={gameInfo.getConfig()?.getDisplayName() || 'Unknown'}
            subheader={`Host: ${gameInfo.getOwner()?.getDisplayName() || 'Unknown'}`}
          />
          <CardContent style={{paddingTop: 0, paddingBottom: 0}}>
            <Typography>
              {gameInfo.getIsRunning() ? 'In Progress' : 'Not Running'}
            </Typography>
            <Typography>
              {`Last active ${convertTime(gameInfo.getLastActivityTime())}`}
            </Typography>
          </CardContent>
          <CardActions>
            {
              game.view?.getGameId() === gameInfo.getGameId() ?
                <Button onClick={() => {
                  props.gameService.leaveGame().then(refresh);
                }}>Leave</Button> :
                <Button onClick={() => {
                  props.gameService.joinGame(gameInfo.getGameId()).then(() => {
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

      <div className={globalClasses.contentWrap}>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={5} className={'center'}>
            <div style={{maxWidth: '200px', textAlign: 'center', display: 'inline-block'}}>
              <TextField
                label={'Query'}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              <div style={{marginTop: '8px'}}>
                <NumberBoundTextField
                  style={{width: '47%', float: 'left'}}
                  label={'Player Slots Available'}
                  value={minAvailablePlayerSlots}
                  minValue={0}
                  maxValue={9}
                  onChange={setMinAvailablePlayerSlots}
                />
              </div>
              <Button
                size={'small'}
                style={{marginBottom: '5px', marginTop: '10px'}}
                onClick={refresh}
                disabled={isLoading}
                variant={'contained'}
                color={'secondary'}
              >
                <RefreshIcon className={classes.leftIcon}/>
                Refresh
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} sm={7}>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default GameList;