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

  getUserSessions() {
    return axios.get(`/api/sessions?userId=${this.userId}`)
      .then((response) => (response.data))
      .then((sessions) => (
        sessions.map((session: any) => ({...session, createdAt: new Date(session.createdAt)}))
      ));
  }

  deleteSession(sessionId: string) {
    return axios.delete(`/api/session?sessionId=${sessionId}`)
      .then(() => {});
  }
}
