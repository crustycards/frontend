import Auth from './models/auth';
import Cardpack from './models/cardpack';
import Friend from './models/friend';
import User from './models/user';

export default class {
  constructor({authUrl, apiUrl}) {
    this.auth = new Auth(authUrl);
    this.cardpack = new Cardpack(apiUrl);
    this.friend = new Friend(apiUrl);
    this.user = new User(apiUrl);
  }
}
