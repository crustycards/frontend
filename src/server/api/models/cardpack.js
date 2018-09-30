const axios = require('axios');

export default class {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async getById(cardpackId) {
    const response = await axios.get(`${this.apiUrl}/cardpack/${cardpackId}`);
    return response.data;
  }

  async getByUser(userId) {
    const response = await axios.get(`${this.apiUrl}/${userId}/cardpacks`);
    return response.data;
  }

  async create(userId, name) {
    const response = await axios.put(`${this.apiUrl}/${userId}/cardpack`, {name});
    return response.data;
  }
}
