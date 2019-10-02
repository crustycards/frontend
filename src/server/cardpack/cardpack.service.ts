import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {EnvironmentService} from '../environment/environment.service';
import {BlackCard} from './interfaces/blackCard.interface';
import {Cardpack} from './interfaces/cardpack.interface';
import {JsonBlackCard} from './interfaces/jsonBlackCard.interface';
import {JsonWhiteCard} from './interfaces/jsonWhiteCard.interface';
import {WhiteCard} from './interfaces/whiteCard.interface';

@Injectable()
export class CardpackService {
  private apiServiceUrl: string;

  constructor(envService: EnvironmentService) {
    this.apiServiceUrl = envService.getArgs().apiUrl;
  }

  public async createCardpack(userId: string, name: string): Promise<Cardpack> {
    const response = await axios.put(`${this.apiServiceUrl}/${userId}/cardpack`, {name});
    return response.data;
  }

  public async getCardpackById(cardpackId: string): Promise<Cardpack> {
    const response = await axios.get(`${this.apiServiceUrl}/cardpack/${cardpackId}`);
    return response.data;
  }

  public async getCardpacksByUser(userId: string): Promise<Cardpack[]> {
    const response = await axios.get(`${this.apiServiceUrl}/${userId}/cardpacks`);
    return response.data;
  }

  public async patchCardpack(cardpackId: string, data: any[]): Promise<void> {
    await axios.patch(`${this.apiServiceUrl}/cardpack/${cardpackId}`, data);
  }

  public async deleteCardpack(cardpackId: string): Promise<void> {
    await axios.delete(`${this.apiServiceUrl}/cardpack/${cardpackId}`);
  }

  public async createWhiteCards(cardpackId: string, cards: JsonWhiteCard[]): Promise<WhiteCard[]> {
    const response = await axios.put(`${this.apiServiceUrl}/cardpack/${cardpackId}/cards/white`, cards);
    return response.data;
  }

  public async createBlackCards(cardpackId: string, cards: JsonBlackCard[]): Promise<BlackCard[]> {
    const response = await axios.put(`${this.apiServiceUrl}/cardpack/${cardpackId}/cards/black`, cards);
    return response.data;
  }

  public async deleteWhiteCard(cardpackId: string, cardId: string): Promise<void> {
    await axios.delete(`${this.apiServiceUrl}/cardpack/${cardpackId}/cards/white/${cardId}`);
  }

  public async deleteBlackCard(cardpackId: string, cardId: string): Promise<void> {
    await axios.delete(`${this.apiServiceUrl}/cardpack/${cardpackId}/cards/black/${cardId}`);
  }

  public async favoriteCardpack(userId: string, cardpackId: string): Promise<void> {
    await axios.put(`${this.apiServiceUrl}/user/${userId}/cardpacks/favorite?cardpackId=${cardpackId}`);
  }

  public async unfavoriteCardpack(userId: string, cardpackId: string): Promise<void> {
    await axios.delete(`${this.apiServiceUrl}/user/${userId}/cardpacks/favorite?cardpackId=${cardpackId}`);
  }

  public async getFavoritedCardpacks(userId: string): Promise<Cardpack[]> {
    const response = await axios.get(`${this.apiServiceUrl}/user/${userId}/cardpacks/favorite`);
    return response.data;
  }

  public async checkIfCardpackIsFavorited(userId: string, cardpackId: string): Promise<boolean> {
    const response = await axios.get(`${this.apiServiceUrl}/user/${userId}/cardpacks/favorite/${cardpackId}`);
    return response.data;
  }

  public async searchCardpacks(query: string): Promise<Cardpack[]> {
    const response = await axios.get(`${this.apiServiceUrl}/search/cardpack?query=${query}`);
    return response.data;
  }

  public async searchCardpacksAutocomplete(query: string): Promise<string[]> {
    const response = await axios.get(`${this.apiServiceUrl}/search/cardpack/autocomplete?query=${query}`);
    return response.data;
  }
}
