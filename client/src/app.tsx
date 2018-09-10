import * as React from 'react';
import {Component} from 'react';
import {Provider} from 'react-redux';
import Home from './pages/Home';
import Cardpack from './pages/Cardpack';
import User from './pages/User.jsx';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Game from './pages/Game';
import GameList from './pages/GameList';
import Settings from './pages/Settings';
import Navbar from './components/Navbar.jsx';
import StatusBar from './components/StatusBar.jsx';
import './styles/index.scss';
import {Route, Switch} from 'react-router';
import {DragDropContextProvider} from 'react-dnd/lib';
import DragDropHTML5Backend from 'react-dnd-html5-backend';
import {ConnectedRouter} from 'connected-react-router';
import AuthRedirector from './components/AuthRedirector';
import {init as initFirebase} from './firebase';
import {Provider as ApiContextProvider} from './api/context';
import HttpMainApi from './api/http/httpMainApi';
import HttpGameApi from './api/http/httpGameApi';
import HttpAuthApi from './api/http/httpAuthApi';
import createStore from './store/index';
import {createBrowserHistory} from 'history';
import GameApi from './api/model/gameApi';
import MainApi from './api/model/mainApi';
import AuthApi from './api/model/authApi';
import {bindGameApi} from './api/reduxBind';

declare global {
  interface Window {
    __PRELOADED_STATE__: any
  }
}

const userId = window.__PRELOADED_STATE__.user ? window.__PRELOADED_STATE__.user.id : null;

const mainApi: MainApi = new HttpMainApi(userId);
const gameApi: GameApi = new HttpGameApi(userId);
const authApi: AuthApi = new HttpAuthApi(userId);
const history = createBrowserHistory();
const store = createStore({history});

bindGameApi(gameApi, store);

initFirebase((payload) => console.log(payload))
  .then((token) => authApi.linkSessionToFirebase(token));

setInterval(() => {
  gameApi.getGameState();
}, 500); // TODO - Find a way to remove this intermittent polling

export class App extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <DragDropContextProvider backend={DragDropHTML5Backend}>
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
          </DragDropContextProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}
