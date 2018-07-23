import MainApi from './mainApi';
import GameApi from './gameApi';

export default interface Api {
  main: MainApi
  game: GameApi
}