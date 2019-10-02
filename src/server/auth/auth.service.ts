import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {EnvironmentService} from '../environment/environment.service';
import {Session} from './interfaces/session.interface';

@Injectable()
export class AuthService {
  private authServiceUrl: string;

  constructor(envService: EnvironmentService) {
    this.authServiceUrl = envService.getArgs().authServerUrl;
  }

  public async getSessionById(sessionId: string): Promise<Session> {
    const response = await axios.get(`${this.authServiceUrl}/session?sessionId=${sessionId}`);
    return response.data;
  }

  public async getSessionsByUserId(userId: string): Promise<Session[]> {
    const response = await axios.get(`${this.authServiceUrl}/sessions?userId=${userId}`);
    return response.data;
  }

  public async createSession(userId: string): Promise<Session> {
    const response = await axios.put(`${this.authServiceUrl}/session?userId=${userId}`);
    return response.data;
  }

  public async deleteSession(sessionId: string): Promise<void> {
    await axios.delete(`${this.authServiceUrl}/session?sessionId=${sessionId}`);
  }

  public async deleteUserSessions(userId: string): Promise<void> {
    await axios.delete(`${this.authServiceUrl}/sessions?userId=${userId}`);
  }

  public async linkSessionToFirebase(sessionId: string, firebaseToken: string): Promise<void> {
    await axios.put(`${this.authServiceUrl}/session/${sessionId}?token=${firebaseToken}`);
  }
}
