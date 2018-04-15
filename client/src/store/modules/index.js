import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import global from './global.js';
import user from './user.js';
import game from './game.js';
import games from './games.js';

export default combineReducers({
  global,
  user,
  game,
  games
});