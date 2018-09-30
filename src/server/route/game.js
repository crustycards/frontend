const Boom = require('boom');
const gameUrl = process.env.GAME_SERVER_URL;

module.exports = [
  {
    method: 'GET',
    path: '/api/games',
    handler: (request, h) => {
      return h.proxy({uri: `${gameUrl}/games`});
    }
  },
  {
    method: 'DELETE',
    path: '/api/game/players',
    handler: (request, h) => {
      const {kickerId, kickeeId} = request.query;
      if (kickerId === undefined || kickeeId === undefined) {
        throw Boom.badRequest('Must provide query parameters for kickerId and kickeeId');
      } else {
        return h.proxy({uri: `${gameUrl}/${kickerId}/game/players/${kickeeId}`});
      }
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'DELETE',
    path: '/api/game/players/{userId}',
    handler: (request, h) => {
      return h.proxy({uri: `${gameUrl}/{userId}/game`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'GET',
    path: '/api/game/{userId}',
    handler: (request, h) => {
      return h.proxy({uri: `${gameUrl}/{userId}/game`});
    }
  },
  {
    method: 'PUT',
    path: '/api/game/continue/{userId}',
    handler: (request, h) => {
      return h.proxy({uri: `${gameUrl}/{userId}/game/continue`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'POST',
    path: '/api/game/create/{userId}',
    handler: (request, h) => {
      return h.proxy({uri: `${gameUrl}/{userId}/game/create`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'PUT',
    path: '/api/game/messages/{userId}',
    handler: (request, h) => {
      return h.proxy({uri: `${gameUrl}/{userId}/game/messages`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'PUT',
    path: '/api/game/play/{userId}',
    handler: (request, h) => {
      return h.proxy({uri: `${gameUrl}/{userId}/game/play`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'DELETE',
    path: '/api/game/play/{userId}',
    handler: (request, h) => {
      return h.proxy({uri: `${gameUrl}/{userId}/game/play`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'POST',
    path: '/api/game/start/{userId}',
    handler: (request, h) => {
      return h.proxy({uri: `${gameUrl}/{userId}/game/start`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'POST',
    path: '/api/game/stop/{userId}',
    handler: (request, h) => {
      return h.proxy({uri: `${gameUrl}/{userId}/game/stop`});
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'PUT',
    path: '/api/game/vote/{userId}',
    handler: (request, h) => {
      const {cardId} = request.query;
      if (cardId === undefined) {
        throw Boom.badRequest('Must provide query parameter for cardId');
      } else {
        return h.proxy({uri: `${gameUrl}/{userId}/game/vote/${cardId}`});
      }
    },
    options: {payload: {parse: false}}
  },
  {
    method: 'POST',
    path: '/api/game/join/{userId}',
    handler: (request, h) => {
      const {gameName} = request.query;
      if (gameName === undefined) {
        throw Boom.badRequest('Must provide query parameter for gameName');
      } else {
        return h.proxy({uri: `${gameUrl}/{userId}/game/${gameName}/join`});
      }
    },
    options: {payload: {parse: false}}
  }
];
