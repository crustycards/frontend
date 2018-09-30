import axios from 'axios';
import { Session } from '../../../client/src/api/dao';

export default class {
  private authServerUrl: string;

  constructor(authServerUrl: string) {
    this.authServerUrl = authServerUrl;
  }

  async createSession(userId: string): Promise<Session> {
    const response = await axios.put(`${this.authServerUrl}/session?userId=${userId}`);
    return response.data;
  }

  async getSession(sessionId: string): Promise<Session> {
    try {
      const response = await axios.get(`${this.authServerUrl}/session?sessionId=${sessionId}`);
      return response.data;
    } catch (err) {
      return null;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    await axios.delete(`${this.authServerUrl}/session?sessionId=${sessionId}`);
  }
}
