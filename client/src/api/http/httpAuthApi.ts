import axios from 'axios';
import AuthApi from '../model/authApi';
import * as _ from 'underscore';

export default class HttpAuthApi implements AuthApi {
  private userId: string

  constructor(currentUserId: string) {
    this.userId = currentUserId;

    _.bindAll(this, ...Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
  }

  linkSessionToFirebase(firebaseToken: string) {
    return axios.put(`/api/session?token=${firebaseToken}`)
      .then(() => {});
  }
}
