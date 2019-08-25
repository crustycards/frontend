import * as Boom from '@hapi/boom';
import {Server} from '@hapi/hapi';
import {ProxyResponseToolkit, Request} from '../model';

export default (server: Server, gameUrl: string) => {
  server.route([
    {
      method: 'GET',
      path: '/api/games',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${gameUrl}/games`});
      }
    },
    {
      method: 'DELETE',
      path: '/api/game/players/kick',
      handler: (request: Request, h: ProxyResponseToolkit) => {
        const {kickerUserId, kickeeUserId} = request.query;
        if (kickerUserId === undefined || kickeeUserId === undefined) {
          throw Boom.badRequest('Must provide query parameters for kickerUserId and kickeeUserId');
        } else {
          return h.proxy({uri: `${gameUrl}/${kickerUserId}/game/players/kick/${kickeeUserId}`});
        }
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'DELETE',
      path: '/api/game/players/ban',
      handler: (request: Request, h: ProxyResponseToolkit) => {
        const {bannerUserId, banneeUserId} = request.query;
        if (bannerUserId === undefined || banneeUserId === undefined) {
          throw Boom.badRequest('Must provide query parameters for bannerUserId and banneeUserId');
        } else {
          return h.proxy({uri: `${gameUrl}/${bannerUserId}/game/players/ban/${banneeUserId}`});
        }
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'PUT',
      path: '/api/game/players/unban',
      handler: (request: Request, h: ProxyResponseToolkit) => {
        const {unbannerUserId, unbanneeUserId} = request.query;
        if (unbannerUserId === undefined || unbanneeUserId === undefined) {
          throw Boom.badRequest('Must provide query parameters for unbannerUserId and unbanneeUserId');
        } else {
          return h.proxy({uri: `${gameUrl}/${unbannerUserId}/game/players/unban/${unbanneeUserId}`});
        }
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'DELETE',
      path: '/api/game/players/{userId}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${gameUrl}/{userId}/game`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'GET',
      path: '/api/game/{userId}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${gameUrl}/{userId}/game`});
      }
    },
    {
      method: 'PUT',
      path: '/api/game/continue/{userId}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${gameUrl}/{userId}/game/continue`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'POST',
      path: '/api/game/create/{userId}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${gameUrl}/{userId}/game/create`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'PUT',
      path: '/api/game/messages/{userId}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${gameUrl}/{userId}/game/messages`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'PUT',
      path: '/api/game/play/{userId}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${gameUrl}/{userId}/game/play`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'DELETE',
      path: '/api/game/play/{userId}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${gameUrl}/{userId}/game/play`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'POST',
      path: '/api/game/start/{userId}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${gameUrl}/{userId}/game/start`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'POST',
      path: '/api/game/stop/{userId}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${gameUrl}/{userId}/game/stop`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'PUT',
      path: '/api/game/vote/{userId}',
      handler: (request: Request, h: ProxyResponseToolkit) => {
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
      handler: (request: Request, h: ProxyResponseToolkit) => {
        const {gameName} = request.query;
        if (gameName === undefined) {
          throw Boom.badRequest('Must provide query parameter for gameName');
        } else {
          return h.proxy({uri: `${gameUrl}/{userId}/game/${gameName}/join`});
        }
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'POST',
      path: '/api/game/artificialPlayers/add/{userId}',
      handler: (request: Request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${gameUrl}/{userId}/game/artificialPlayers/add`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'POST',
      path: '/api/game/artificialPlayers/remove/{userId}',
      handler: (request: Request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${gameUrl}/{userId}/game/artificialPlayers/remove`});
      },
      options: {payload: {parse: false}}
    }
  ]);
};
