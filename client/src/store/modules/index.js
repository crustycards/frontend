import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import home from './home.js';
import game from './game.js';

export default combineReducers({
  home,
  game
});