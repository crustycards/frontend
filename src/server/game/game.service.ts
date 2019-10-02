import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {EnvironmentService} from '../environment/environment.service';
import {GameData} from './interfaces/gameData.interface';
import {GameInfo} from './interfaces/gameInfo.interface';

@Injectable()
export class GameService {
  private gameServiceUrl: string;

  constructor(envService: EnvironmentService) {
    this.gameServiceUrl = envService.getArgs().gameServerUrl;
  }

  public async createGame(
    userId: string,
    gameName: string,
    maxPlayers: number,
    maxScore: number,
    handSize: number,
    cardpackIds: string[]
  ): Promise<GameData> {
    const response = await axios.post(`${this.gameServiceUrl}/${userId}/game/create`, {
      gameName,
      maxPlayers,
      maxScore,
      handSize,
      cardpackIds
    });
    return response.data;
  }

  public async startGame(userId: string): Promise<GameData> {
    const response = await axios.post(`${this.gameServiceUrl}/${userId}/game/start`);
    return response.data;
  }

  public async stopGame(userId: string): Promise<GameData> {
    const response = await axios.post(`${this.gameServiceUrl}/${userId}/game/stop`);
    return response.data;
  }

  public async joinGame(userId: string, gameName: string): Promise<GameData> {
    const response = await axios.post(`${this.gameServiceUrl}/${userId}/game/${gameName}/join`);
    return response.data;
  }

  public async leaveGame(userId: string): Promise<void> {
    const response = await axios.delete(`${this.gameServiceUrl}/${userId}/game`);
    return response.data;
  }

  public async addArtificialPlayers(
    userId: string,
    data: {
      artificialPlayerName: string,
      amount: number
    }
  ): Promise<GameData> {
    const response = await axios.post(`${this.gameServiceUrl}/${userId}/game/artificialPlayers/add`, data);
    return response.data;
  }

  public async removeArtificialPlayers(
    userId: string,
    data: {
      artificialPlayerName: string,
      amount: number
    }
  ): Promise<GameData> {
    const response = await axios.post(`${this.gameServiceUrl}/${userId}/game/artificialPlayers/remove`, data);
    return response.data;
  }

  public async getGameState(userId: string): Promise<GameData> {
    const response = await axios.get(`${this.gameServiceUrl}/${userId}/game`);
    return response.data;
  }

  public async getGameList(): Promise<GameInfo[]> {
    const response = await axios.get(`${this.gameServiceUrl}/games`);
    return response.data;
  }

  public async playCards(userId: string, cardIds: string[]): Promise<void> {
    const response = await axios.put(`${this.gameServiceUrl}/${userId}/game/play`, cardIds);
    return response.data;
  }

  public async unPlayCards(userId: string): Promise<void> {
    const response = await axios.delete(`${this.gameServiceUrl}/${userId}/game/play`);
    return response.data;
  }

  public async kickPlayer(userId: string, playerId: string): Promise<GameData> {
    const response = await axios.delete(`${this.gameServiceUrl}/${userId}/game/players/kick/${playerId}`);
    return response.data;
  }

  public async banPlayer(userId: string, playerId: string): Promise<GameData> {
    const response = await axios.delete(`${this.gameServiceUrl}/${userId}/game/players/ban/${playerId}`);
    return response.data;
  }

  public async unbanPlayer(userId: string, playerId: string): Promise<GameData> {
    const response = await axios.put(`${this.gameServiceUrl}/${userId}/game/players/unban/${playerId}`);
    return response.data;
  }

  public async vote(userId: string, cardId: string): Promise<void> {
    const response = await axios.put(`${this.gameServiceUrl}/${userId}/game/vote/${cardId}`);
    return response.data;
  }

  public async startNextRound(userId: string): Promise<void> {
    const response = await axios.put(`${this.gameServiceUrl}/${userId}/game/continue`);
    return response.data;
  }

  public async sendMessage(userId: string, text: string): Promise<GameData> {
    const response = await axios.put(`${this.gameServiceUrl}/${userId}/game/messages`, text, {headers: {'Content-Type': 'text/plain'}});
    return response.data;
  }
}
