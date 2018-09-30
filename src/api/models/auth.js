const axios = require('axios');
const auth = process.env.AUTH_SERVER_URL;

const createSession = async (userId) => {
  const response = await axios.put(`${auth}/session?userId=${userId}`);
  return response.data;
};

const getSession = (sessionId) => {
  return axios.get(`${auth}/session?sessionId=${sessionId}`)
      .then((res) => res.data)
      .catch(() => null);
};

const deleteSession = (sessionId) => {
  return axios.delete(`${auth}/session?sessionId=${sessionId}`)
      .then(() => {});
};

module.exports = {
  createSession,
  getSession,
  deleteSession
};
