import axios from 'axios';
import * as _ from 'underscore';
import AuthApi from '../model/authApi';

export default class HttpAuthApi implements AuthApi {
  private userId: string;

  constructor(currentUserId: string) {
    this.userId = currentUserId;

    _.bindAll(this, ...Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
  }

  public getUserSessions() {
    return axios.get(`/api/sessions?userId=${this.userId}`)
      .then((response) => (response.data))
      .then((sessions) => (
        sessions.map((session: any) => ({...session, createdAt: new Date(session.createdAt)}))
      ));
  }

  public deleteSession(sessionId: string) {
    return axios.delete(`/api/session?sessionId=${sessionId}`)
      .then(() => null);
  }
}
