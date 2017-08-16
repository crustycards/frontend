import React from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NotFound from './pages/NotFound.jsx';
import './styles.css';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import { Provider } from 'react-redux';
import store from './store';

const App = (props) => (
  <Router history={browserHistory}>
    <Route path='/' component={Home}/>
    <Route path='/login' component={Login}/>
    <Route path='/signup' component={Signup}/>
    <Route path='*' component={NotFound}/>
  </Router>
);

ReactDOM.render(
  <Provider store={store}> 
    <App />
  </Provider>,
  document.getElementById('app'));