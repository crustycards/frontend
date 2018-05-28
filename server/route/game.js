const Boom = require('boom');
const gameUrl = process.env.GAME_SERVER_URL;

module.exports = [
  {
    method: 'GET',
    path: '/api/games',
    handler: (request, reply) => {
      reply.proxy({ uri: `${gameUrl}/games` });
    }
  },
  {
    method: 'DELETE',
    path: '/api/game/players',
    handler: (request, reply) => {
      const { kickerId, kickeeId } = request.query;
      if (kickerId === undefined || kickeeId === undefined) {
        reply(Boom.badRequest('Must provide query parameters for kickerId and kickeeId'));
      } else {
        reply.proxy({ uri: `${gameUrl}/${kickerId}/game/players/${kickeeId}` });
      }
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'DELETE',
    path: '/api/game/players/{userId}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${gameUrl}/{userId}/game` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'GET',
    path: '/api/game/{userId}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${gameUrl}/{userId}/game` });
    }
  },
  {
    method: 'PUT',
    path: '/api/game/continue/{userId}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${gameUrl}/{userId}/game/continue` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'POST',
    path: '/api/game/create/{userId}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${gameUrl}/{userId}/game/create` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'PUT',
    path: '/api/game/play/{userId}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${gameUrl}/{userId}/game/play` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'POST',
    path: '/api/game/start/{userId}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${gameUrl}/{userId}/game/start` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'POST',
    path: '/api/game/stop/{userId}',
    handler: (request, reply) => {
      reply.proxy({ uri: `${gameUrl}/{userId}/game/stop` });
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'PUT',
    path: '/api/game/vote/{userId}',
    handler: (request, reply) => {
      const { cardId } = request.query;
      if (cardId === undefined) {
        reply(Boom.badRequest('Must provide query parameter for cardId'));
      } else {
        reply.proxy({ uri: `${gameUrl}/{userId}/game/vote/${cardId}` });
      }
    },
    config: { payload: { parse: false } }
  },
  {
    method: 'POST',
    path: '/api/game/join/{userId}',
    handler: (request, reply) => {
      const { gameName } = request.query;
      if (gameName === undefined) {
        reply(Boom.badRequest('Must provide query parameter for gameName'));
      } else {
        reply.proxy({ uri: `${gameUrl}/{userId}/game/join/${gameName}` });
      }
    },
    config: { payload: { parse: false } }
  }
];