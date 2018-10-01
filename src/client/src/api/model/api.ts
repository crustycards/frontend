import AuthApi from './authApi';
import GameApi from './gameApi';
import MainApi from './mainApi';

interface Api {
  main: MainApi;
  game: GameApi;
  auth: AuthApi;
}

export default Api;
