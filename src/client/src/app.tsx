import {blue} from '@material-ui/core/colors';
import {
  createMuiTheme,
  MuiThemeProvider,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import {ConnectedRouter} from 'connected-react-router';
import {createBrowserHistory} from 'history';
import * as React from 'react';
import {DndProvider} from 'react-dnd';
import DragDropHTML5Backend from 'react-dnd-html5-backend';
import {Provider, useSelector} from 'react-redux';
import {Route, Switch} from 'react-router';
import * as Socket from 'socket.io-client';
import {UserSettings} from '../../../proto-gen-out/api/model_pb';
import {getPreloadedUser} from './getPreloadedState';
import {Provider as GameServiceContextProvider} from './api/context';
import {GameService} from './api/gameService';
import {UserService} from './api/userService';
import AuthRedirector from './components/AuthRedirector';
import Navbar from './components/Navbar';
import StatusBar from './components/StatusBar';
import CardpackPage from './pages/CardpackPage';
import GamePage from './pages/GamePage';
import GameListPage from './pages/GameListPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import SettingsPage from './pages/SettingsPage';
import UserPage from './pages/UserPage';
import createStore, {StoreState} from './store/index';
import './styles/index.scss';

const history = createBrowserHistory();
const store = createStore({history});
const preloadedUser = getPreloadedUser();
const gameService = preloadedUser ?
                      new GameService(preloadedUser.getName(), store) :
                      undefined;
const userService = new UserService(
  preloadedUser ? preloadedUser.getName() : undefined,
  store
);

// Connect through socket.io
const socket = Socket({
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: Infinity
});
socket.on('connect', () => {
  if (gameService) {
    gameService.getGameView(); // Fetch game state for the initial render
  }
}).on('reconnect', () => {
  if (gameService) {
    gameService.getGameView(); // Game state might be stale if reconnecting
  }
}).on('message', (message: string) => {
  if (message === 'GAME_UPDATED') {
    if (gameService) {
      gameService.getGameView();
    }
  }
});

// Fallback to intermittent polling if socket.io can't connect
setInterval(() => {
  if (!socket.connected) {
    if (gameService) {
      gameService.getGameView();
    }
  }
}, 500);

export const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <DndProvider backend={DragDropHTML5Backend}>
        <GameServiceContextProvider value={{gameService, userService}}>
          <ThemedSubApp/>
        </GameServiceContextProvider>
      </DndProvider>
    </ConnectedRouter>
  </Provider>
);

const ThemedSubApp = () => {
  const {userSettings} = useSelector(
    ({global: {userSettings}}: StoreState) => ({userSettings})
  );
  const isDarkMode =
    userSettings?.getColorScheme() === UserSettings.ColorScheme.DEFAULT_DARK;

  const theme = createMuiTheme({
    palette: {
      primary: blue,
      secondary: {
        main: '#43c6a8'
      },
      type: isDarkMode ? 'dark' : 'light'
    }
  });

  return (
    <MuiThemeProvider theme={theme}>
      <SubApp/>
    </MuiThemeProvider>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(1),
      height: '100%',
      overflowY: 'auto'
    }
  })
);

const SubApp = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AuthRedirector/>
      <Navbar/>
      <StatusBar/>
      <Switch>
        <Route exact path='/' component={HomePage}/>
        <Route
          exact
          path='/users/:user/cardpacks/:cardpack'
          component={CardpackPage}
        />
        <Route exact path='/users/:user' component={UserPage}/>
        <Route exact path='/login' component={LoginPage}/>
        <Route exact path='/game' component={GamePage}/>
        <Route exact path='/gamelist' component={GameListPage}/>
        <Route exact path='/settings' component={SettingsPage}/>
        <Route component={NotFoundPage}/>
      </Switch>
    </div>
  );
};