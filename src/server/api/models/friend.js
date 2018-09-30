const axios = require('axios');

export default class {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async getFriends(userId) {
    const response = await axios.get(`${this.apiUrl}/user/${userId}/friends`);
    return response.data;
  }

  async getSentRequests(userId) {
    const response = await axios.get(`${this.apiUrl}/user/${userId}/friends/requests/sent`);
    return response.data;
  }

  async getReceivedRequests(userId) {
    const response = await axios.get(`${this.apiUrl}/user/${userId}/friends/requests/received`);
    return response.data;
  }
}
