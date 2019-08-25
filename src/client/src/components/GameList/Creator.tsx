import {
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
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

const generateNumberedMenuItems = (startNum: number, endNum: number): JSX.Element[] => {
  const items = [];
  for (let i = startNum; i <= endNum; i++) {
    items.push(<MenuItem value={i} key={i}>{i}</MenuItem>);
  }
  return items;
};

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

const GameCreator = () => {
  const [gameName, setGameName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [maxScore, setMaxScore] = useState(8);
  const [handSize, setHandSize] = useState(8);
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

  const handleSubmit = () => {
    setIsCreatingGame(true);
    api.game.createGame(
      gameName,
      maxPlayers,
      maxScore,
      handSize,
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
            <TextField
              name='gameName'
              label='Game Name'
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
            <br/>
            <span>Max Players: </span>
            <Select
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value as string, 10))}
            >
              {generateNumberedMenuItems(4, 20)}
            </Select>
            <br/>
            <span>Winning Score: </span>
            <Select
              value={maxScore}
              onChange={(e) => setMaxScore(parseInt(e.target.value as string, 10))}
            >
              {generateNumberedMenuItems(4, 20)}
            </Select>
            <br/>
            <span>Hand Size: </span>
            <Select
              value={handSize}
              onChange={(e) => setHandSize(parseInt(e.target.value as string, 10))}
            >
              {generateNumberedMenuItems(3, 20)}
            </Select>
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
        <Button disabled={isCreatingGame} type='submit' onClick={handleSubmit}>Submit</Button>
        {isCreatingGame && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  );
};

export default GameCreator;
