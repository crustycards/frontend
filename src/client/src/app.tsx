import {blue, teal} from '@mui/material/colors';
import {
  createTheme,
  ThemeProvider
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {ConnectedRouter} from 'connected-react-router';
import {createBrowserHistory} from 'history';
import * as React from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {Provider, useSelector} from 'react-redux';
import {Route, Switch} from 'react-router';
import * as Socket from 'socket.io-client';
import {UserSettings} from '../../../proto-gen-out/crusty_cards_api/model_pb';
import {getPreloadedUser} from './getPreloadedState';
import {Provider as GameServiceContextProvider} from './api/context';
import {GameService} from './api/gameService';
import {UserService} from './api/userService';
import AuthRedirector from './components/AuthRedirector';
import Navbar from './components/Navbar';
import StatusBar from './components/StatusBar';
import CustomCardpackListPage from './pages/CustomCardpackListPage';
import CustomCardpackPage from './pages/CustomCardpackPage';
import GamePage from './pages/GamePage';
import GameListPage from './pages/GameListPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import SettingsPage from './pages/SettingsPage';
import UserPage from './pages/UserPage';
import createStore, {StoreState} from './store/index';
import DefaultCardpackListPage from './pages/DefaultCardpackListPage';
import DefaultCardpackPage from './pages/DefaultCardpackPage';

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
      // TODO - It looks like since upgrading to socket.io 4.x.x, this line is always being hit. Let's figure out what's happening.
      gameService.getGameView();
    }
  }
}, 500);

export const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <DndProvider backend={HTML5Backend}>
        <GameServiceContextProvider value={{gameService, userService}}>
          <ThemedSubApp/>
        </GameServiceContextProvider>
      </DndProvider>
    </ConnectedRouter>
  </Provider>
);

const Root = styled('div')(({theme}) => ({
  backgroundColor: theme.palette.background.default,
  height: '100%',
  overflowY: 'auto'
}));

const SubApp = () => (
  <Root>
    {/* This meta tag makes the mobile experience
    much better by preventing text from being tiny. */}
    <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
    <AuthRedirector/>
    <Navbar/>
    <StatusBar/>
    <Switch>
      <Route exact path='/' component={AuthRedirector}/>
      <Route
        exact
        path='/users/:user/cardpacks'
        component={CustomCardpackListPage}
      />
      <Route
        exact
        path='/users/:user/cardpacks/:cardpack'
        component={CustomCardpackPage}
      />
      <Route
        exact
        path='/defaultCardpacks'
        component={DefaultCardpackListPage}
      />
      <Route
        exact
        path='/defaultCardpacks/:cardpack'
        component={DefaultCardpackPage}
      />
      <Route exact path='/users/:user' component={UserPage}/>
      <Route exact path='/login' component={LoginPage}/>
      <Route exact path='/game' component={GamePage}/>
      <Route exact path='/gamelist' component={GameListPage}/>
      <Route exact path='/settings' component={SettingsPage}/>
      <Route component={NotFoundPage}/>
    </Switch>
  </Root>
);

const ThemedSubApp = () => {
  const {userSettings} = useSelector(
    ({global: {userSettings}}: StoreState) => ({userSettings})
  );
  const isDarkMode =
    userSettings?.getColorScheme() === UserSettings.ColorScheme.DEFAULT_DARK;

  const theme = createTheme({
    palette: {
      primary: blue,
      secondary: teal,
      mode: isDarkMode ? 'dark' : 'light'
    },
    props: {
      MuiAppBar: {
        color: isDarkMode ? 'default' : 'primary'
      },
      MuiTypography: {
        color: 'textPrimary'
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <SubApp/>
    </ThemeProvider>
  );
};