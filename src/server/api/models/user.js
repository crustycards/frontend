const axios = require('axios');

export default class {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async getById(id) {
    const response = await axios.get(`${this.apiUrl}/user`, {params: {id}});
    return response.data;
  }

  async getByOAuth({oAuthId, oAuthProvider}) {
    if (!!oAuthId ^ !!oAuthProvider) {
      throw new Error('Must provide either oAuth data or user Id');
    }
    const response = await axios.get(`${this.apiUrl}/user`, {params: {oAuthId, oAuthProvider}});
    return response.data;
  }

  async create({name, oAuthId, oAuthProvider}) {
    if (!(name && oAuthId && oAuthProvider)) {
      throw new Error('Not all parameters were provided');
    }
    const response = await axios.put(`${this.apiUrl}/user`, {name, oAuthId, oAuthProvider});
    return response.data;
  }

  async findOrCreate({name, oAuthId, oAuthProvider}) {
    try {
      return await this.getByOAuth({oAuthId, oAuthProvider});
    } catch (err) {
      return this.create({name, oAuthId, oAuthProvider});
    }
  }
}
