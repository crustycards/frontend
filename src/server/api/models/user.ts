import { User } from "../../../client/src/api/dao";

const axios = require('axios');

export default class {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getById(id: string): Promise<User> {
    const response = await axios.get(`${this.apiUrl}/user`, {params: {id}});
    return response.data;
  }

  async getByOAuth({oAuthId, oAuthProvider}: {oAuthId: string, oAuthProvider: string}): Promise<User> {
    const response = await axios.get(`${this.apiUrl}/user`, {params: {oAuthId, oAuthProvider}});
    return response.data;
  }

  async create({name, oAuthId, oAuthProvider}: {name: string, oAuthId: string, oAuthProvider: string}): Promise<User> {
    const response = await axios.put(`${this.apiUrl}/user`, {name, oAuthId, oAuthProvider});
    return response.data;
  }

  async findOrCreate({name, oAuthId, oAuthProvider}: {name: string, oAuthId: string, oAuthProvider: string}): Promise<User> {
    try {
      return await this.getByOAuth({oAuthId, oAuthProvider});
    } catch (err) {
      return this.create({name, oAuthId, oAuthProvider});
    }
  }
}
