import {combineReducers} from 'redux';
import global from './global';
import game from './game';
import games from './games';
import {reducer as formReducer} from 'redux-form';

export default combineReducers({
  global,
  game,
  games,
  form: formReducer
});
