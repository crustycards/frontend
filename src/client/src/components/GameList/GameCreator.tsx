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
  Typography,
  Paper
} from '@mui/material';
import {Empty} from 'google-protobuf/google/protobuf/empty_pb';
import {createStyles, makeStyles} from '@material-ui/styles';
import {push} from 'connected-react-router';
import * as React from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {CustomCardpack, GameConfig, User, DefaultCardpack} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {GameService} from '../../api/gameService';
import {
  listCustomCardpacks,
  listFavoritedCustomCardpacks,
  listDefaultCardpacks
} from '../../api/cardpackService';
import {
  ListCustomCardpacksRequest,
  ListDefaultCardpacksRequest,
  ListFavoritedCustomCardpacksRequest
} from '../../../../../proto-gen-out/crusty_cards_api/cardpack_service_pb';
import NumberBoundTextField from '../../components/NumberBoundTextField';
import {UserService} from '../../api/userService';
import {showStatusMessage} from '../../store/modules/global'
import {useGlobalStyles} from '../../styles/globalStyles';
import LoadableCustomCardpackCard from './LoadableCustomCardpackCard';
import LoadableDefaultCardpackCard from './LoadableDefaultCardpackCard';
import InfiniteScrollCheckboxList from './InfiniteScrollCheckboxList';

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
  if (!config.hasEndlessMode() && maxScoreIsOutOfRange) {
    config.setMaxScore(defaultScoreLimit);
  }

  if (!config.hasBlankWhiteCardConfig()) {
    config.setBlankWhiteCardConfig(new GameConfig.BlankWhiteCardConfig());
  }

  if (config.getBlankWhiteCardConfig()?.getBehavior() ===
      GameConfig.BlankWhiteCardConfig.Behavior.BEHAVIOR_UNSPECIFIED) {
    config.getBlankWhiteCardConfig()
      ?.setBehavior(GameConfig.BlankWhiteCardConfig.Behavior.DISABLED);
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

  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  const handleCustomCardpackSelectChange = (customCardpackName: string) => {
    const currentCustomCardpackNamesList = config.getCustomCardpackNamesList();
    let newCardpackNamesList: string[] = [];
    if (currentCustomCardpackNamesList.includes(customCardpackName)) {
      newCardpackNamesList = currentCustomCardpackNamesList.filter(
        (cId) => cId !== customCardpackName
      );
    } else {
      newCardpackNamesList = [
        ...currentCustomCardpackNamesList,
        customCardpackName
      ].sort();
    }
    const newConfig = config.clone();
    newConfig.setCustomCardpackNamesList(newCardpackNamesList);
    setConfig(newConfig);
  };

  const handleDefaultCardpackSelectChange = (defaultCardpackName: string) => {
    const currentDefaultCardpackNamesList =
      config.getDefaultCardpackNamesList();
    let newCardpackNamesList: string[] = [];
    if (currentDefaultCardpackNamesList.includes(defaultCardpackName)) {
      newCardpackNamesList = currentDefaultCardpackNamesList.filter(
        (cId) => cId !== defaultCardpackName
      );
    } else {
      newCardpackNamesList = [
        ...currentDefaultCardpackNamesList,
        defaultCardpackName
      ].sort();
    }
    const newConfig = config.clone();
    newConfig.setDefaultCardpackNamesList(newCardpackNamesList);
    setConfig(newConfig);
  };

  const emptyFieldErrors = [];
  if (!config.getDisplayName().length) {
    emptyFieldErrors.push('Game name cannot be blank');
  }

  if (!config.getCustomCardpackNamesList().length &&
      !config.getDefaultCardpackNamesList().length) {
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
        variant={'h4'}
        align={'center'}
      >
        Create Game
      </Typography>
      <div className={globalClasses.contentWrap}>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={5} className={globalClasses.center}>
            <Paper elevation={3}>
              <div style={{padding: '20px', maxWidth: '200px', textAlign: 'center', display: 'inline-block'}}>
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
                    disabled={config.hasEndlessMode()}
                  />
                </div>
                <FormControlLabel
                  style={{marginTop: '5px', marginBottom: '5px'}}
                  control={
                    <Checkbox
                      checked={config.hasEndlessMode()}
                      onChange={() => {
                        const newConfig = config.clone();
                        if (!config.hasEndlessMode()) {
                          newConfig.setEndlessMode(new Empty());
                        }
                        if (!newConfig.hasEndlessMode()) {
                          newConfig.setMaxScore(defaultScoreLimit);
                        }
                        setConfig(newConfig);
                      }}
                    />
                  }
                  label={
                    <Typography>
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
                    style={{margin: '10px 10px 0 10px'}}
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
                    style={{margin: '10px 10px 0 10px'}}
                    onClick={() => {
                      setConfig(fillGameConfigWithDefaultValues(
                        props.quickStartGameConfig?.clone() || new GameConfig()
                      ));
                    }}
                    disabled={configHasSaveableChanges}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </Paper>
            <div>
              <div className={globalClasses.subpanel}>
                <Typography
                  variant={'h6'}
                  align={'center'}
                >
                  Selected Custom Cardpacks
                </Typography>
                <List>
                  {
                    config
                      .getCustomCardpackNamesList()
                      .map((customCardpackName) => (
                        <ListItem
                          key={customCardpackName}
                        >
                          <ListItemText
                            primary={
                              <LoadableCustomCardpackCard
                                customCardpackName={customCardpackName}
                                onRemove={
                                  () => handleCustomCardpackSelectChange(
                                    customCardpackName)
                                }
                              />
                            }
                          />
                        </ListItem>
                      ))
                  }
                </List>
              </div>
              <div className={globalClasses.subpanel}>
                <Typography
                  variant={'h6'}
                  align={'center'}
                >
                  Selected Default Cardpacks
                </Typography>
                <List>
                  {
                    config
                      .getDefaultCardpackNamesList()
                      .map((defaultCardpackName) => (
                        <ListItem
                          key={defaultCardpackName}
                        >
                          <ListItemText
                            primary={
                              <LoadableDefaultCardpackCard
                                defaultCardpackName={defaultCardpackName}
                                onRemove={
                                  () => handleDefaultCardpackSelectChange(
                                    defaultCardpackName)
                                }
                              />
                            }
                          />
                        </ListItem>
                      ))
                  }
                </List>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={7}>
            <InfiniteScrollCheckboxList<CustomCardpack>
              headerName={'Your Custom Cardpacks'}
              loadItems={
                async (pageToken, amount) => {
                  const request = new ListCustomCardpacksRequest();
                  request.setPageToken(pageToken);
                  request.setPageSize(amount);
                  request.setParent(props.currentUser.getName());
                  const response = await listCustomCardpacks(request);
                  return {
                    items: response.getCustomCardpacksList(),
                    nextPageToken: response.getNextPageToken()
                  };
                }
              }
              checkedItemNames={config.getCustomCardpackNamesList()}
              toggleItemCheckedState={
                (item) => handleCustomCardpackSelectChange(item.getName())
              }
            />
            <InfiniteScrollCheckboxList<CustomCardpack>
              headerName={'Your Favorited Cardpacks'}
              loadItems={
                async (pageToken, amount) => {
                  const request = new ListFavoritedCustomCardpacksRequest();
                  request.setPageToken(pageToken);
                  request.setPageSize(amount);
                  request.setParent(props.currentUser.getName());
                  const response = await listFavoritedCustomCardpacks(request);
                  return {
                    items: response.getCustomCardpacksList(),
                    nextPageToken: response.getNextPageToken()
                  };
                }
              }
              checkedItemNames={config.getCustomCardpackNamesList()}
              toggleItemCheckedState={
                (item) => handleCustomCardpackSelectChange(item.getName())
              }
            />
            <InfiniteScrollCheckboxList<DefaultCardpack>
              headerName={'Default Cardpacks'}
              loadItems={
                async (pageToken, amount) => {
                  const request = new ListDefaultCardpacksRequest();
                  request.setPageToken(pageToken);
                  request.setPageSize(amount);
                  const response = await listDefaultCardpacks(request);
                  return {
                    items: response.getDefaultCardpacksList(),
                    nextPageToken: response.getNextPageToken()
                  };
                }
              }
              checkedItemNames={config.getDefaultCardpackNamesList()}
              toggleItemCheckedState={
                (item) => handleDefaultCardpackSelectChange(item.getName())
              }
            />
          </Grid>
        </Grid>
      </div>
      <div className={`${globalClasses.center} ${classes.wrapper}`}>
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
