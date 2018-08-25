const Boom = require('boom');
const apiUrl = process.env.API_URL;

module.exports = [
  {
    method: 'GET',
    path: '/api/user/{id}',
    handler: (request, reply) => {
      reply.proxy({uri: `${apiUrl}/user/{id}`});
    }
  },
  {
    method: 'PATCH',
    path: '/api/user/{id}',
    handler: (request, reply) => {
      reply.proxy({uri: `${apiUrl}/user/{id}`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'GET',
    path: '/api/user/friends/{id}',
    handler: (request, reply) => {
      reply.proxy({uri: `${apiUrl}/user/{id}/friends`});
    }
  },
  {
    method: 'GET',
    path: '/api/user/friends/requests/sent/{id}',
    handler: (request, reply) => {
      reply.proxy({uri: `${apiUrl}/user/{id}/friends/requests/sent`});
    }
  },
  {
    method: 'GET',
    path: '/api/user/friends/requests/received/{id}',
    handler: (request, reply) => {
      reply.proxy({uri: `${apiUrl}/user/{id}/friends/requests/received`});
    }
  },
  {
    method: ['PUT', 'DELETE'],
    path: '/api/user/friends',
    handler: (request, reply) => {
      const {userId, friendId} = request.query;

      if (userId === undefined || friendId === undefined) {
        reply(Boom.badRequest('Must provide query parameters for userId and friendId'));
      } else {
        reply.proxy({uri: `${apiUrl}/user/${userId}/friends/${friendId}`});
      }
    },
    options: {payload: {parse: false}}
  }
];
