import Auth from './models/auth';
import Cardpack from './models/cardpack';
import Friend from './models/friend';
import User from './models/user';

export default class {
  public auth: Auth;
  public cardpack: Cardpack;
  public friend: Friend;
  public user: User;

  constructor({authUrl, apiUrl}: {authUrl: string, apiUrl: string}) {
    this.auth = new Auth(authUrl);
    this.cardpack = new Cardpack(apiUrl);
    this.friend = new Friend(apiUrl);
    this.user = new User(apiUrl);
  }
}
