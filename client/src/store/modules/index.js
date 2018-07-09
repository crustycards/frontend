import {combineReducers} from 'redux';
import global from './global.js';
import game from './game.js';
import games from './games.js';
import userPage from './userPage';
import {reducer as formReducer} from 'redux-form';

export default combineReducers({
  global,
  game,
  games,
  userPage,
  form: formReducer
});
