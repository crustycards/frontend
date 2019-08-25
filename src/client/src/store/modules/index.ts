import { connectRouter } from 'connected-react-router';
import {History} from 'history';
import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import game from './game';
import games from './games';
import global from './global';

export default (history: History) => combineReducers({
  router: connectRouter(history),
  form: formReducer,
  global,
  game,
  games
});
