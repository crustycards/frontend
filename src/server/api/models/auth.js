const axios = require('axios');

export default class {
  constructor(authServerUrl) {
    this.authServerUrl = authServerUrl;
  }

  async createSession(userId) {
    const response = await axios.put(`${this.authServerUrl}/session?userId=${userId}`);
    return response.data;
  }

  async getSession(sessionId) {
    try {
      const response = await axios.get(`${this.authServerUrl}/session?sessionId=${sessionId}`);
      return response.data;
    } catch (err) {
      return null;
    }
  }

  async deleteSession(sessionId) {
    await axios.delete(`${this.authServerUrl}/session?sessionId=${sessionId}`);
  }
}
