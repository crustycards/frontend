const axios = require('axios')
const api = process.env.API_URL

const getFriends = async (userId) => {
  const response = await axios.get(`${api}/user/${userId}/friends`)
  return response.data
}

const getSentRequests = async (userId) => {
  const response = await axios.get(`${api}/user/${userId}/friends/requests/sent`)
  return response.data
}

const getReceivedRequests = async (userId) => {
  const response = await axios.get(`${api}/user/${userId}/friends/requests/received`)
  return response.data
}

module.exports = {
  getFriends,
  getSentRequests,
  getReceivedRequests
}
