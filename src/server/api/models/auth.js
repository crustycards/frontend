const axios = require('axios');

export default class {
  constructor(authServerUrl) {
    this.authServerUrl = authServerUrl;
  }

  async createSession(userId) {
    const response = await axios.put(`${this.authServerUrl}/session?userId=${userId}`);
    return response.data;
  }

  getSession(sessionId) {
    return axios.get(`${this.authServerUrl}/session?sessionId=${sessionId}`)
        .then((res) => res.data)
        .catch(() => null);
  }

  deleteSession(sessionId) {
    return axios.delete(`${this.authServerUrl}/session?sessionId=${sessionId}`)
        .then(() => {});
  }
}
