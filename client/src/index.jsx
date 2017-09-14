import React from 'react';

import { render} from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/index.js';

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Home from './pages/Home.jsx';
import Cardpack from './pages/Cardpack.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotFound from './pages/NotFound.jsx';
import Game from './pages/Game.jsx';
import GameList from './pages/GameList.jsx';
import Navbar from './components/Navbar.jsx';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';
import { Router, Route, browserHistory, Switch } from 'react-router';


render(
  <Provider store={store}>
    <BrowserRouter basename="/">
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
          <Navbar/>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/cardpack' component={Cardpack}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/signup' component={Signup}/>
            <Route exact path='/game' component={Game}/>
            <Route exact path='/gamelist' component={GameList}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </MuiThemeProvider>
    </BrowserRouter>
  </Provider>
  , document.getElementById('app'));