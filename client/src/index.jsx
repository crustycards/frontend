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
import Board from './pages/Board.jsx';
import './styles.css';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';


render(
  <Provider store={store}> 
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
      <Router history={browserHistory}>
        <Route path='/' component={Home}/>
        <Route path='/cardpack' component={Cardpack}/>
        <Route path='/login' component={Login}/>
        <Route path='/signup' component={Signup}/>
        <Route path='/game' component={Board}/>
        <Route path='*' component={NotFound}/>
      </Router>
    </MuiThemeProvider>
  </Provider>
  , document.getElementById('app'));