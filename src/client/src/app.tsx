import {blue} from '@material-ui/core/colors';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {ConnectedRouter} from 'connected-react-router';
import {createBrowserHistory} from 'history';
import * as React from 'react';
import {DndProvider} from 'react-dnd';
import DragDropHTML5Backend from 'react-dnd-html5-backend';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router';
import * as Socket from 'socket.io-client';
import {Provider as ApiContextProvider} from './api/context';
import HttpAuthApi from './api/http/httpAuthApi';
import HttpGameApi from './api/http/httpGameApi';
import HttpMainApi from './api/http/httpMainApi';
import AuthApi from './api/model/authApi';
import GameApi from './api/model/gameApi';
import MainApi from './api/model/mainApi';
import {bindGameApi} from './api/reduxBind';
import AuthRedirector from './components/AuthRedirector';
import Navbar from './components/Navbar';
import StatusBar from './components/StatusBar';
import {init as initFirebase} from './firebase';
import Cardpack from './pages/Cardpack';
import Game from './pages/Game';
import GameList from './pages/GameList';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import User from './pages/User';
import createStore from './store/index';
import './styles/index.scss';

declare global {
  interface Window {
    __PRELOADED_STATE__: any;
  }
}

const userId = window.__PRELOADED_STATE__.user ? window.__PRELOADED_STATE__.user.id : null;

const mainApi: MainApi = new HttpMainApi(userId);
const gameApi: GameApi = new HttpGameApi(userId);
const authApi: AuthApi = new HttpAuthApi(userId);
const history = createBrowserHistory();
const store = createStore({history});

bindGameApi(gameApi, store);

// Connect through socket.io
const socket = Socket({
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: Infinity
});
socket.on('connect', () => {
  gameApi.getGameState(); // Fetch game state for the initial render
}).on('reconnect', () => {
  gameApi.getGameState(); // Game state might be stale if reconnecting
}).on('message', (message: string) => {
  if (message === 'GAME_UPDATED') {
    gameApi.getGameState();
  } else if (message === 'GAME_LIST_UPDATED') {
    gameApi.getGameList();
  }
});

// Fallback to intermittent polling if socket.io can't connect
setInterval(() => {
  if (!socket.connected) {
    gameApi.getGameState();
  }
});

// TODO - Uncomment two lines below once HTTPS is setup
// initFirebase((payload) => console.log(payload))
//   .then((token) => authApi.linkSessionToFirebase(token));

const theme = createMuiTheme({palette: {primary: blue, secondary: {main: '#43c6a8'}}});

export const App = () => (
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <DndProvider backend={DragDropHTML5Backend}>
          <ApiContextProvider value={{main: mainApi, game: gameApi, auth: authApi}}>
            <div>
              <AuthRedirector/>
              <Navbar/>
              <StatusBar/>
              <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/cardpack' component={Cardpack}/>
                <Route exact path='/user' component={User}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/game' component={Game}/>
                <Route exact path='/gamelist' component={GameList}/>
                <Route exact path='/settings' component={Settings}/>
                <Route component={NotFound}/>
              </Switch>
            </div>
          </ApiContextProvider>
        </DndProvider>
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>
);
