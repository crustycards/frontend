import { User } from "../../../client/src/api/dao";

const axios = require('axios');

export default class {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getFriends(userId: string): Promise<Array<User>> {
    const response = await axios.get(`${this.apiUrl}/user/${userId}/friends`);
    return response.data;
  }

  async getSentRequests(userId: string): Promise<Array<User>> {
    const response = await axios.get(`${this.apiUrl}/user/${userId}/friends/requests/sent`);
    return response.data;
  }

  async getReceivedRequests(userId: string): Promise<Array<User>> {
    const response = await axios.get(`${this.apiUrl}/user/${userId}/friends/requests/received`);
    return response.data;
  }
}
