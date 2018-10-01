import AuthApi from './authApi';
import GameApi from './gameApi';
import MainApi from './mainApi';

export default interface Api {
  main: MainApi;
  game: GameApi;
  auth: AuthApi;
}
