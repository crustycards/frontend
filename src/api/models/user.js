const axios = require('axios');
const api = process.env.API_URL;

const getById = async (id) => {
  const response = await axios.get(`${api}/user`, {params: {id}});
  return response.data;
};

const getByOAuth = async ({oAuthId, oAuthProvider}) => {
  if (!!oAuthId ^ !!oAuthProvider) {
    throw new Error('Must provide either oAuth data or user Id');
  }
  const response = await axios.get(`${api}/user`, {params: {oAuthId, oAuthProvider}});
  return response.data;
};

const create = async ({name, oAuthId, oAuthProvider}) => {
  if (!(name && oAuthId && oAuthProvider)) {
    throw new Error('Not all parameters were provided');
  }
  const response = await axios.put(`${api}/user`, {name, oAuthId, oAuthProvider});
  return response.data;
};

const findOrCreate = async ({name, oAuthId, oAuthProvider}) => {
  try {
    return await getByOAuth({oAuthId, oAuthProvider});
  } catch (err) {
    return create({name, oAuthId, oAuthProvider});
  }
};

module.exports = {
  getById,
  getByOAuth,
  create,
  findOrCreate
};
