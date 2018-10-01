import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import game from './game';
import games from './games';
import global from './global';

export default combineReducers({
  global,
  game,
  games,
  form: formReducer
});
