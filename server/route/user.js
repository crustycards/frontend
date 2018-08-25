const Boom = require('boom');
const apiUrl = process.env.API_URL;

module.exports = [
  {
    method: 'GET',
    path: '/api/user/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/user/{id}`});
    }
  },
  {
    method: 'PATCH',
    path: '/api/user/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/user/{id}`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'GET',
    path: '/api/user/friends/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/user/{id}/friends`});
    }
  },
  {
    method: 'GET',
    path: '/api/user/friends/requests/sent/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/user/{id}/friends/requests/sent`});
    }
  },
  {
    method: 'GET',
    path: '/api/user/friends/requests/received/{id}',
    handler: (request, h) => {
      return h.proxy({uri: `${apiUrl}/user/{id}/friends/requests/received`});
    }
  },
  {
    method: ['PUT', 'DELETE'],
    path: '/api/user/friends',
    handler: (request, h) => {
      const {userId, friendId} = request.query;

      if (userId === undefined || friendId === undefined) {
        throw Boom.badRequest('Must provide query parameters for userId and friendId');
      } else {
        return h.proxy({uri: `${apiUrl}/user/${userId}/friends/${friendId}`});
      }
    },
    options: {payload: {parse: false}}
  }
];
