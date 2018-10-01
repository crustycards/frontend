import axios from 'axios';
import { Cardpack } from '../../../client/src/api/dao';

export default class {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async getById(cardpackId: string): Promise<Cardpack> {
    const response = await axios.get(`${this.apiUrl}/cardpack/${cardpackId}`);
    return response.data;
  }

  public async getByUser(userId: string): Promise<Cardpack[]> {
    const response = await axios.get(`${this.apiUrl}/${userId}/cardpacks`);
    return response.data;
  }

  public async create(userId: string, name: string): Promise<Cardpack> {
    const response = await axios.put(`${this.apiUrl}/${userId}/cardpack`, {name});
    return response.data;
  }
}
