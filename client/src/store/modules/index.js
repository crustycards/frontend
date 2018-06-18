import { combineReducers } from 'redux'
import global from './global.js'
import user from './user.js'
import game from './game.js'
import games from './games.js'
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
  global,
  user,
  game,
  games,
  form: formReducer
})
