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
  Theme
} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import {push} from 'connected-react-router';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useApi} from '../../api/context';
import {Cardpack} from '../../api/dao';

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
    }
  })
);

const updateBoundedNumber = (
  currentValue: {str: string, num: number},
  newStrValue: string,
  setNewValue: (val: {str: string, num: number}) => void,
  lowerBound: number,
  upperBound: number
) => {
  const newStrParsed = parseInt(newStrValue, 10);
  let newNum = newStrParsed;

  if (isNaN(newStrParsed)) {
    newNum = currentValue.num;
  } else if (newStrParsed < lowerBound) {
    newNum = lowerBound;
  } else if (newStrParsed > upperBound) {
    newNum = upperBound;
  }

  setNewValue({str: newStrValue, num: newNum});
};

const resolveBoundedNumber = (
  currentValue: {str: string, num: number},
  setNewValue: (val: {str: string, num: number}) => void
) => {
  if (currentValue.str !== currentValue.num.toString()) {
    setNewValue({str: currentValue.num.toString(), num: currentValue.num});
  }
};

const GameCreator = () => {
  const [gameName, setGameName] = useState('');
  // These states contain a matching string and number to allow
  // the user to type potentially invalid values (such as clearing
  // the textbox and typing '10') and still remember the last
  // valid number that was entered so that it can be set back if
  // the user clicks away while the textbox is still blank.
  const [maxPlayers, setMaxPlayers] = useState({str: '8', num: 8});
  const [maxScore, setMaxScore] = useState({str: '8', num: 8});
  const [handSize, setHandSize] = useState({str: '8', num: 8});
  const [endlessMode, setEndlessMode] = useState(false);
  const [userCardpacks, setUserCardpacks] = useState([] as Cardpack[]);
  const [subscribedCardpacks, setSubscribedCardpacks] = useState([] as Cardpack[]);
  const [cardpacksSelected, setCardpacksSelected] = useState([] as string[]);
  const [isLoadingCardpacks, setIsLoadingCardpacks] = useState(true);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const api = useApi();
  const dispatch = useDispatch();
  const classes = useStyles({});

  const handleSelectChange = (id: string) => {
    if (cardpacksSelected.includes(id)) {
      setCardpacksSelected(cardpacksSelected.filter((cId) => cId !== id));
    } else {
      setCardpacksSelected([...cardpacksSelected, id]);
    }
  };

  const emptyFieldErrors = [];
  if (!gameName) {
    emptyFieldErrors.push('Game name cannot be blank');
  }
  if (!cardpacksSelected.length) {
    emptyFieldErrors.push('Must select at least one cardpack');
  }
  const canSubmit = !emptyFieldErrors.length;

  const handleSubmit = () => {
    setIsCreatingGame(true);
    api.game.createGame(
      gameName,
      maxPlayers.num,
      endlessMode ? 0 : maxScore.num,
      handSize.num,
      cardpacksSelected
    ).then(() => {
      dispatch(push('/game'));
    }).finally(() => {
      setIsCreatingGame(false);
    });
  };

  const loadCardpacks = () => {
    Promise.all([api.main.getCardpacksByUser(), api.main.getFavoritedCardpacks()])
      .then(([userCardpacks, subscribedCardpacks]) => {
        setUserCardpacks(userCardpacks);
        setSubscribedCardpacks(subscribedCardpacks);
        setIsLoadingCardpacks(false);
      });
  };

  useEffect(() => {
    loadCardpacks();
  }, []);

  return (
    <div>
      <h2>Create Game</h2>
      <div className='content-wrap'>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={5} className={'center'}>
            <div style={{maxWidth: '200px', textAlign: 'center', display: 'inline-block'}}>
              <TextField
                label={'Game Name'}
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
              />
              <div style={{marginTop: '8px'}}>
                <TextField
                  style={{width: '47%', float: 'left'}}
                  label={'Max Players'}
                  value={maxPlayers.str}
                  inputProps={{min: 2, max: 100}}
                  onChange={(e) => updateBoundedNumber(maxPlayers, e.target.value, setMaxPlayers, 2, 100)}
                  onBlur={() => resolveBoundedNumber(maxPlayers, setMaxPlayers)}
                  type={'number'}
                />
                <TextField
                  style={{width: '47%', float: 'right'}}
                  label={'Winning Score'}
                  value={maxScore.str}
                  inputProps={{min: 1, max: 100}}
                  onChange={(e) => updateBoundedNumber(maxScore, e.target.value, setMaxScore, 1, 100)}
                  onBlur={() => resolveBoundedNumber(maxScore, setMaxScore)}
                  type={'number'}
                  disabled={endlessMode}
                />
              </div>
              <FormControlLabel
                style={{marginTop: '5px', marginBottom: '5px'}}
                control={
                  <Checkbox
                    checked={endlessMode}
                    onChange={() => setEndlessMode(!endlessMode)}
                  />
                }
                label={'Endless Mode'}
              />
              <TextField
                label={'Hand Size'}
                value={handSize.str}
                inputProps={{min: 3, max: 20}}
                onChange={(e) => updateBoundedNumber(handSize, e.target.value, setHandSize, 3, 20)}
                onBlur={() => resolveBoundedNumber(handSize, setHandSize)}
                type={'number'}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={7}>
            <div className='subpanel'>
              {isLoadingCardpacks ?
                <div style={{textAlign: 'center'}}>
                  <h3>Loading Cardpacks...</h3>
                  <CircularProgress/>
                </div>
                :
                <div>
                  {/* TODO - Keep code dry by refactoring the two <List/> uses below into separate component */}
                  <h3>Your Cardpacks</h3>
                  <List>
                    {userCardpacks.map((c) => (
                      <ListItem
                        key={c.id}
                      >
                        <Checkbox
                          checked={cardpacksSelected.includes(c.id)}
                          onChange={() => handleSelectChange(c.id)}
                        />
                        <ListItemText primary={c.name} />
                      </ListItem>
                    ))}
                  </List>
                  <h3>Subscribed Cardpacks</h3>
                  <List>
                    {subscribedCardpacks.map((c) => (
                      <ListItem
                        key={c.id}
                      >
                        <Checkbox
                          checked={cardpacksSelected.includes(c.id)}
                          onChange={() => handleSelectChange(c.id)}
                        />
                        <ListItemText primary={c.name} />
                      </ListItem>
                    ))}
                  </List>
                </div>
              }
            </div>
          </Grid>
        </Grid>
      </div>
      <div className={`center ${classes.wrapper}`}>
        <Button type='submit' disabled={isCreatingGame || !canSubmit} onClick={handleSubmit}>Submit</Button>
        {emptyFieldErrors.map((error, index) => (
          <div key={index}>{error}</div>
        ))}
        {isCreatingGame && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  );
};

export default GameCreator;
