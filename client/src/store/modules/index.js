import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import home from './home.js';
import game from './game.js';
import games from './games.js';
import cardpacks from './cardpacks.js';

export default combineReducers({
  home,
  game,
  games,
  cardpacks
});