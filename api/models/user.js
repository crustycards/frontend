const axios = require('axios')
const api = process.env.API_URL

const get = async ({id, oAuthId, oAuthProvider}) => {
  if ((!id && !oAuthId && !oAuthProvider) || (id && oAuthId && oAuthProvider) || (!!oAuthId ^ !!oAuthProvider)) {
    throw new Error('Must provide either oAuth data or user Id')
  }
  const response = await axios.get(`${api}/user`, {params: {id, oAuthId, oAuthProvider}})
  return response.data
}

const create = async ({name, oAuthId, oAuthProvider}) => {
  if (!(name && oAuthId && oAuthProvider)) {
    throw new Error('Not all parameters were provided')
  }
  const response = await axios.put(`${api}/user`, {name, oAuthId, oAuthProvider})
  return response.data
}

const findOrCreate = async ({name, oAuthId, oAuthProvider}) => {
  try {
    return await get({oAuthId, oAuthProvider})
  } catch (err) {
    return await create({name, oAuthId, oAuthProvider})
  }
}

module.exports = {
  get,
  create,
  findOrCreate
}
