import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {AuthService} from '../auth/auth.service';
import {EnvironmentService} from '../environment/environment.service';
import {User} from './interfaces/user.interface';

@Injectable()
export class UserService {
  private apiServiceUrl: string;

  constructor(private readonly envService: EnvironmentService, private readonly authService: AuthService) {
    this.apiServiceUrl = envService.getArgs().apiUrl;
  }

  public async getById(id: string): Promise<User> {
    const response = await axios.get(`${this.apiServiceUrl}/user`, {params: {id}});
    return response.data;
  }

  public async getByOAuth({oAuthId, oAuthProvider}: {oAuthId: string, oAuthProvider: string}): Promise<User> {
    const response = await axios.get(`${this.apiServiceUrl}/user`, {params: {oAuthId, oAuthProvider}});
    return response.data;
  }

  public async getBySessionId(sessionId: string): Promise<User> {
    const session = await this.authService.getSessionById(sessionId);
    if (!session) {
      return null;
    }
    return await this.getById(session.userId);
  }

  public async findOrCreate({
    name,
    oAuthId,
    oAuthProvider
  }: {
    name: string,
    oAuthId: string,
    oAuthProvider: string
  }): Promise<User> {
    try {
      return await this.getByOAuth({oAuthId, oAuthProvider});
    } catch (err) {
      return this.create({name, oAuthId, oAuthProvider});
    }
  }

  public async patchUser(userId: string, patchData: any[]): Promise<void> {
    await axios.patch(`${this.apiServiceUrl}/user/${userId}`, patchData);
  }

  public async getUserProfileImage(userId: string): Promise<ArrayBuffer> {
    // ResponseType is there to tell axios to make response.data an ArrayBuffer instead of a string
    const response = await axios.get(
      `${this.apiServiceUrl}/user/${userId}/profileimage`,
      {responseType: 'arraybuffer'}
    );
    return response.data;
  }

  public async setUserProfileImage(userId: string, data: ArrayBuffer): Promise<void> {
    await axios.put(`${this.apiServiceUrl}/user/${userId}/profileimage`, data, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });
  }

  public async searchUsers(query: string): Promise<User[]> {
    const response = await axios.get(`${this.apiServiceUrl}/search/user?query=${query}`);
    return response.data;
  }

  public async searchUsersAutocomplete(query: string): Promise<string[]> {
    const response = await axios.get(`${this.apiServiceUrl}/search/user/autocomplete?query=${query}`);
    return response.data;
  }

  public async addFriend(userId: string, friendId: string): Promise<void> {
    await axios.put(`${this.apiServiceUrl}/user/${userId}/friends/${friendId}`);
  }

  public async removeFriend(userId: string, friendId: string): Promise<void> {
    await axios.delete(`${this.apiServiceUrl}/user/${userId}/friends/${friendId}`);
  }

  public async getFriends(userId: string): Promise<User[]> {
    const response = await axios.get(`${this.apiServiceUrl}/user/${userId}/friends`);
    return response.data;
  }

  public async getSentRequests(userId: string): Promise<User[]> {
    const response = await axios.get(`${this.apiServiceUrl}/user/${userId}/friends/requests/sent`);
    return response.data;
  }

  public async getReceivedRequests(userId: string): Promise<User[]> {
    const response = await axios.get(`${this.apiServiceUrl}/user/${userId}/friends/requests/received`);
    return response.data;
  }

  private async create({
    name,
    oAuthId,
    oAuthProvider
  }: {
    name: string,
    oAuthId: string,
    oAuthProvider: string
  }): Promise<User> {
    const response = await axios.put(`${this.apiServiceUrl}/user`, {name, oAuthId, oAuthProvider});
    return response.data;
  }
}
