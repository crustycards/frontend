import MainApi from './mainApi';
import GameApi from './gameApi';
import AuthApi from './authApi';

export default interface Api {
  main: MainApi
  game: GameApi
  auth: AuthApi
};
