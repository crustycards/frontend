import {connectRouter} from 'connected-react-router';
import {History} from 'history';
import {combineReducers} from 'redux';
import game from './game';
import global from './global';

export default (history: History) => combineReducers({
  router: connectRouter(history),
  global,
  game
});
