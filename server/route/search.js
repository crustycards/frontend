const apiUrl = process.env.API_URL

module.exports = [
  {
    method: 'GET',
    path: '/api/cardpack/search',
    handler: (request, reply) => {
      const query = request.query.query

      reply.proxy({ uri: `${apiUrl}/cardpack/search${query ? `?query=${query}` : ''}` })
    }
  },
  {
    method: 'GET',
    path: '/api/cardpack/search/autocomplete',
    handler: (request, reply) => {
      const query = request.query.query

      reply.proxy({ uri: `${apiUrl}/cardpack/search/autocomplete${query ? `?query=${query}` : ''}` })
    }
  },
  {
    method: 'GET',
    path: '/api/user/search',
    handler: (request, reply) => {
      const query = request.query.query

      reply.proxy({ uri: `${apiUrl}/user/search${query ? `?query=${query}` : ''}` })
    }
  },
  {
    method: 'GET',
    path: '/api/user/search/autocomplete',
    handler: (request, reply) => {
      const query = request.query.query

      reply.proxy({ uri: `${apiUrl}/user/search/autocomplete${query ? `?query=${query}` : ''}` })
    }
  }
]
