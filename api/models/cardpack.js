const axios = require('axios')
const api = process.env.API_URL

const getById = async (cardpackId) => {
  const response = await axios.get(`${api}/cardpack/${cardpackId}`)
  return response.data
}

const getByUser = async (userId) => {
  const response = await axios.get(`${api}/${userId}/cardpacks`)
  return response.data
}

const create = async (userId, name) => {
  const response = await axios.put(`${api}/${userId}/cardpack`, {name})
  return response.data
}

module.exports = {
  getById,
  getByUser,
  create
}
