import axios from 'axios';
import { User } from '../../../client/src/api/dao';

export default class {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async getFriends(userId: string): Promise<User[]> {
    const response = await axios.get(`${this.apiUrl}/user/${userId}/friends`);
    return response.data;
  }

  public async getSentRequests(userId: string): Promise<User[]> {
    const response = await axios.get(`${this.apiUrl}/user/${userId}/friends/requests/sent`);
    return response.data;
  }

  public async getReceivedRequests(userId: string): Promise<User[]> {
    const response = await axios.get(`${this.apiUrl}/user/${userId}/friends/requests/received`);
    return response.data;
  }
}
