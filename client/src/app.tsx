import * as React from 'react';
import {Component} from 'react';
import {Provider} from 'react-redux';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Home from './pages/Home.jsx';
import Cardpack from './pages/Cardpack.jsx';
import User from './pages/User.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Game from './pages/Game';
import GameList from './pages/GameList.jsx';
import Settings from './pages/Settings.jsx';
import Navbar from './components/Navbar.jsx';
import StatusBar from './components/StatusBar.jsx';
import './styles/index.scss';
import {Route, Switch} from 'react-router';
import {DragDropContextProvider} from 'react-dnd/lib';
import DragDropHTML5Backend from 'react-dnd-html5-backend';
import {ConnectedRouter} from 'connected-react-router';
import AuthRedirector from './components/AuthRedirector.jsx';
import {init as initFirebase} from './firebase';
import {Provider as ApiContextProvider} from './api/context';
import {mainApi, gameApi, history, store} from './globaldeps';

initFirebase();

// setInterval(getGameState, 500); // TODO - Find a way to remove this intermittent polling

export class App extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <DragDropContextProvider backend={DragDropHTML5Backend}>
              <ApiContextProvider value={{main: mainApi, game: gameApi}}>
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
          </MuiThemeProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}