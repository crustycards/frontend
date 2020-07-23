import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Theme,
  Typography
} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import {push} from 'connected-react-router';
import * as React from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Cardpack, GameConfig, User} from '../../../../../proto-gen-out/api/model_pb';
import {GameService} from '../../api/gameService';
import {listCardpacks} from '../../api/cardpackService';
import {ListCardpacksRequest} from '../../../../../proto-gen-out/api/cardpack_service_pb';
import NumberBoundTextField from '../../components/NumberBoundTextField';
import {UserService} from '../../api/userService';
import {showStatusMessage} from '../../store/modules/global';
import * as InfiniteScroll from 'react-infinite-scroller';
import {useGlobalStyles} from '../../styles/globalStyles';
import LoadableCardpackCard from './LoadableCardpackCard';

const minPlayerLimit = 2;
const maxPlayerLimit = 100;
const defaultPlayerLimit = 8;
const minScoreLimit = 1;
const maxScoreLimit = 100;
const defaultScoreLimit = 8;
const minHandSizeLimit = 3;
const maxHandSizeLimit = 20;
const defaultHandSizeLimit = 8;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative'
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12
    },
    cardpackList: {
      height: '200px',
      overflow: 'auto',
      backgroundColor: theme.palette.background.paper
    },
    cardpackListHeader: {
      padding: theme.spacing(1)
    }
  })
);

const fillGameConfigWithDefaultValues = (config: GameConfig) => {
  if (config.getMaxPlayers() < minPlayerLimit
      || config.getMaxPlayers() > maxPlayerLimit) {
    config.setMaxPlayers(defaultPlayerLimit);
  }

  if (config.getHandSize() < minHandSizeLimit
      || config.getHandSize() > maxHandSizeLimit) {
    config.setHandSize(defaultHandSizeLimit);
  }

  const maxScoreIsOutOfRange = config.getMaxScore() < minScoreLimit
                            || config.getMaxScore() > maxScoreLimit;
  if (!config.getEndlessMode() && maxScoreIsOutOfRange) {
    config.setMaxScore(defaultScoreLimit);
  }

  if (!config.hasBlankCardConfig()) {
    config.setBlankCardConfig(new GameConfig.BlankCardConfig());
  }

  if (config.getBlankCardConfig()?.getBehavior() ===
      GameConfig.BlankCardConfig.Behavior.BEHAVIOR_UNSPECIFIED) {
    config.getBlankCardConfig()
      ?.setBehavior(GameConfig.BlankCardConfig.Behavior.DISABLED);
  }

  return config;
};

const gameConfigsAreEqual =
(configOne: GameConfig | undefined, configTwo: GameConfig | undefined) => {
  if (configOne === undefined || configTwo === undefined) {
    return configOne === undefined && configTwo === undefined;
  } else {
    return configOne.toString() === configTwo.toString();
  }
};

interface GameCreatorProps {
  gameService: GameService;
  userService: UserService;
  currentUser: User;
  quickStartGameConfig: GameConfig | undefined;
}

const GameCreator = (props: GameCreatorProps) => {
  const [config, setConfig] = useState(
    fillGameConfigWithDefaultValues(
      props.quickStartGameConfig?.clone() || new GameConfig()
    )
  );
  const configHasSaveableChanges = gameConfigsAreEqual(
    config, props.quickStartGameConfig);

  const [
    userCardpacks,
    setUserCardpacks
  ] = useState<Cardpack[] | undefined>([]);
  const [
    nextUserCardpackPageToken,
    setNextUserCardpackPageToken
  ] = useState('');
  const [
    hasMoreUserCardpacks,
    setHasMoreUserCardpacks
  ] = useState(true);
  const [
    isLoadingUserCardpacks,
    setIsLoadingUserCardpacks
  ] = useState(false);

  const [
    favoritedCardpacks,
    setFavoritedCardpacks
  ] = useState<Cardpack[] | undefined>([]);
  const [
    nextFavoritedCardpackPageToken,
    setNextFavoritedCardpackPageToken
  ] = useState('');
  const [
    hasMoreFavoritedCardpacks,
    setHasMoreFavoritedCardpacks
  ] = useState(true);
  const [
    isLoadingFavoritedCardpacks,
    setIsLoadingFavoritedCardpacks
  ] = useState(false);

  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  const handleSelectChange = (cardpackName: string) => {
    const currentCardpackNamesList = config.getCardpackNamesList();
    let newCardpackNamesList: string[] = [];
    if (currentCardpackNamesList.includes(cardpackName)) {
      newCardpackNamesList = currentCardpackNamesList.filter(
        (cId) => cId !== cardpackName
      );
    } else {
      newCardpackNamesList = [
        ...currentCardpackNamesList,
        cardpackName
      ].sort();
    }
    const newConfig = config.clone();
    newConfig.setCardpackNamesList(newCardpackNamesList);
    setConfig(newConfig);
  };

  const emptyFieldErrors = [];
  if (!config.getDisplayName().length) {
    emptyFieldErrors.push('Game name cannot be blank');
  }

  if (!config.getCardpackNamesList().length) {
    emptyFieldErrors.push('Must select at least one cardpack');
  }
  const canSubmit = !emptyFieldErrors.length;

  const handleSubmit = () => {
    setIsCreatingGame(true);
    props.gameService.createGame(config).then(() => {
      dispatch(push('/game'));
    }).finally(() => {
      setIsCreatingGame(false);
    });
  };

  return (
    <div>
      <Typography
        className={classes.cardpackListHeader}
        variant={'h4'}
        color={'textPrimary'}
        align={'center'}
      >
        Create Game
      </Typography>
      <div className={globalClasses.contentWrap}>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={5} className={'center'}>
            <div style={{maxWidth: '200px', textAlign: 'center', display: 'inline-block'}}>
              <TextField
                label={'Game Name'}
                value={config.getDisplayName()}
                onChange={(e) => {
                  const newConfig = config.clone();
                  newConfig.setDisplayName(e.target.value);
                  setConfig(newConfig);
                }}
              />
              <div style={{marginTop: '8px'}}>
                <NumberBoundTextField
                  style={{width: '47%', float: 'left'}}
                  label={'Max Players'}
                  value={config.getMaxPlayers()}
                  minValue={minPlayerLimit}
                  maxValue={maxPlayerLimit}
                  onChange={(num) => {
                    const newConfig = config.clone();
                    newConfig.setMaxPlayers(num);
                    setConfig(newConfig);
                  }}
                />
                <NumberBoundTextField
                  style={{width: '47%', float: 'right'}}
                  label={'Winning Score'}
                  value={config.getMaxScore()}
                  minValue={minScoreLimit}
                  maxValue={maxScoreLimit}
                  onChange={(num) => {
                    const newConfig = config.clone();
                    newConfig.setMaxScore(num);
                    setConfig(newConfig);
                  }}
                  disabled={config.getEndlessMode()}
                />
              </div>
              <FormControlLabel
                style={{marginTop: '5px', marginBottom: '5px'}}
                control={
                  <Checkbox
                    checked={config.getEndlessMode()}
                    onChange={() => {
                      const newConfig = config.clone();
                      newConfig.setEndlessMode(!config.getEndlessMode());
                      if (!newConfig.getEndlessMode()) {
                        newConfig.setMaxScore(defaultScoreLimit);
                      }
                      setConfig(newConfig);
                    }}
                  />
                }
                label={
                  <Typography color={'textPrimary'}>
                    Endless Mode
                  </Typography>
                }
              />
              <NumberBoundTextField
                label={'Hand Size'}
                value={config.getHandSize()}
                minValue={minHandSizeLimit}
                maxValue={maxHandSizeLimit}
                onChange={(num) => {
                  const newConfig = config.clone();
                  newConfig.setHandSize(num);
                  setConfig(newConfig);
                }}
              />
              <div>
                <Button
                  color={'secondary'}
                  variant={'contained'}
                  style={{margin: '10px'}}
                  onClick={async () => {
                    try {
                      await props.userService
                        .updateCurrentUserQuickStartGameConfig(config);
                      dispatch(showStatusMessage('Settings saved!'));
                    } catch (e) {
                      dispatch(showStatusMessage(
                        'Settings could not be saved!'));
                    }
                  }}
                  disabled={configHasSaveableChanges}
                >
                  Save
                </Button>
                <Button
                  color={'secondary'}
                  variant={'contained'}
                  style={{margin: '10px'}}
                  onClick={() => {
                    setConfig(fillGameConfigWithDefaultValues(
                      props.quickStartGameConfig?.clone() || new GameConfig()));
                  }}
                  disabled={configHasSaveableChanges}
                >
                  Reset
                </Button>
              </div>
            </div>
            <div>
              <div className={globalClasses.subpanel}>
                <Typography
                  className={classes.cardpackListHeader}
                  variant={'h6'}
                  color={'textPrimary'}
                  align={'center'}
                >
                  Selected Cardpacks
                </Typography>
                <List>
                  {config.getCardpackNamesList().map((cardpackName) => (
                    <ListItem
                      key={cardpackName}
                    >
                      <ListItemText
                        primary={
                          <LoadableCardpackCard
                            cardpackName={cardpackName}
                            onRemove={() => handleSelectChange(cardpackName)}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={7}>
            {
              userCardpacks === undefined ?
                <div>Failed to load your cardpacks!</div> :
                <div className={globalClasses.subpanel}>
                  <Typography className={classes.cardpackListHeader} variant={'h6'} color={'textPrimary'} align={'center'}>
                    Your Cardpacks
                  </Typography>
                  <div className={classes.cardpackList}>
                    <InfiniteScroll
                      useWindow={false}
                      loadMore={async () => {
                        if (!isLoadingUserCardpacks) {
                          const request = new ListCardpacksRequest();
                          request.setPageToken(nextUserCardpackPageToken);
                          request.setPageSize(10);
                          request.setParent(props.currentUser.getName());
                          setIsLoadingUserCardpacks(true);
                          try {
                            const response = await listCardpacks(request);
                            const nextPageToken = response.getNextPageToken();
                            setNextUserCardpackPageToken(nextPageToken);
                            if (nextPageToken.length === 0) {
                              setHasMoreUserCardpacks(false);
                            }
                            setUserCardpacks([
                              ...userCardpacks,
                              ...response.getCardpacksList()
                            ]);
                          } catch (err) {
                            setUserCardpacks(undefined);
                          } finally {
                            setIsLoadingUserCardpacks(false);
                          }
                        }
                      }}
                      loader={<CircularProgress/>}
                      hasMore={hasMoreUserCardpacks}
                    >
                      {
                        <List>
                          {userCardpacks.map((c, i) => (
                            <ListItem
                              key={i}
                            >
                              <Checkbox
                                checked={
                                  config.getCardpackNamesList()
                                        .includes(c.getName())
                                }
                                onChange={() => handleSelectChange(c.getName())}
                              />
                              <ListItemText
                                primary={
                                  <Typography color={'textPrimary'}>
                                    {c.getDisplayName()}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      }
                    </InfiniteScroll>
                  </div>
                </div>
            }
            {
              favoritedCardpacks === undefined ?
                <div>Failed to load your cardpacks!</div> :
                <div className={globalClasses.subpanel}>
                  <Typography className={classes.cardpackListHeader} variant={'h6'} color={'textPrimary'} align={'center'}>
                    Favorited Cardpacks
                  </Typography>
                  <div className={classes.cardpackList}>
                    <InfiniteScroll
                      useWindow={false}
                      loadMore={async () => {
                        if (!isLoadingFavoritedCardpacks) {
                          const request = new ListCardpacksRequest();
                          request.setPageToken(nextFavoritedCardpackPageToken);
                          request.setPageSize(10);
                          request.setParent(props.currentUser.getName());
                          request.setShowFavorited(true);
                          setIsLoadingFavoritedCardpacks(true);
                          try {
                            const response = await listCardpacks(request);
                            const nextPageToken = response.getNextPageToken();
                            setNextFavoritedCardpackPageToken(nextPageToken);
                            if (nextPageToken.length === 0) {
                              setHasMoreFavoritedCardpacks(false);
                            }
                            setFavoritedCardpacks([
                              ...favoritedCardpacks,
                              ...response.getCardpacksList()
                            ]);
                          } catch (err) {
                            setFavoritedCardpacks(undefined);
                          } finally {
                            setIsLoadingFavoritedCardpacks(false);
                          }
                        }
                      }}
                      loader={<CircularProgress/>}
                      hasMore={hasMoreFavoritedCardpacks}
                    >
                      {
                        <List>
                          {favoritedCardpacks.map((c, i) => (
                            <ListItem
                              key={i}
                            >
                              <Checkbox
                                checked={
                                  config.getCardpackNamesList()
                                        .includes(c.getName())
                                }
                                onChange={() => handleSelectChange(c.getName())}
                              />
                              <ListItemText
                                primary={
                                  <Typography color={'textPrimary'}>
                                    {c.getDisplayName()}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      }
                    </InfiniteScroll>
                  </div>
                </div>
            }
          </Grid>
        </Grid>
      </div>
      <div className={`center ${classes.wrapper}`}>
        <Button
          type='submit'
          disabled={isCreatingGame || !canSubmit}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        {emptyFieldErrors.map((error, index) => (
          <Typography key={index} color={'error'}>{error}</Typography>
        ))}
        {
          isCreatingGame &&
            <CircularProgress
              size={24}
              className={classes.buttonProgress}
            />
        }
      </div>
    </div>
  );
};

export default GameCreator;
