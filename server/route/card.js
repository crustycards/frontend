const apiUrl = process.env.API_URL

module.exports = [
  {
    method: 'DELETE',
    path: '/api/cardpack/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cardpack/{id}` })
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'GET',
    path: '/api/cardpack/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cardpack/{id}` })
    }
  },
  {
    method: 'PATCH',
    path: '/api/cardpack/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cardpack/{id}` })
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'PUT',
    path: '/api/cardpack/cards/black/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cardpack/{id}/cards/black` })
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'PUT',
    path: '/api/cardpack/cards/white/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cardpack/{id}/cards/white` })
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'DELETE',
    path: '/api/cards/black/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cards/black/{id}` })
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'DELETE',
    path: '/api/cards/white/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/cards/white/{id}` })
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'PUT',
    path: '/api/cardpacks/{userId}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/{userId}/cardpack` })
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'GET',
    path: '/api/cardpacks/{id}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${apiUrl}/{id}/cardpacks` })
    }
  }
]
