import * as Boom from 'boom';
import {Server} from 'hapi';
import {ProxyResponseToolkit, Request} from '../model';

export default (server: Server, apiUrl: string) => {
  server.route([
    {
      method: 'DELETE',
      path: '/api/cardpack/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/cardpack/{id}`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'GET',
      path: '/api/cardpack/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/cardpack/{id}`});
      }
    },
    {
      method: 'PATCH',
      path: '/api/cardpack/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/cardpack/{id}`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'PUT',
      path: '/api/cardpack/cards/black/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/cardpack/{id}/cards/black`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'PUT',
      path: '/api/cardpack/cards/white/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/cardpack/{id}/cards/white`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'DELETE',
      path: '/api/cards/black/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/cards/black/{id}`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'DELETE',
      path: '/api/cards/white/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/cards/white/{id}`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'PUT',
      path: '/api/cardpacks/{userId}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/{userId}/cardpack`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'GET',
      path: '/api/cardpacks/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/{id}/cardpacks`});
      }
    },
    {
      method: ['PUT', 'DELETE'],
      path: '/api/cardpacks/favorite/{userId}',
      handler: (request: Request, h: ProxyResponseToolkit) => {
        const {cardpackId} = request.query;
        if (!cardpackId) {
          throw Boom.badRequest('Must provide query parameter for sessionId');
        }
        return h.proxy({uri: `${apiUrl}/user/{userId}/cardpacks/favorite?cardpackId=${cardpackId}`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'GET',
      path: '/api/cardpacks/favorite/{userId}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/user/{userId}/cardpacks/favorite`});
      }
    },
    {
      method: 'GET',
      path: '/api/cardpacks/favorited',
      handler: (request: Request, h: ProxyResponseToolkit) => {
        const {userId, cardpackId} = request.query;
        if (userId && cardpackId) {
          return h.proxy({uri: `${apiUrl}/user/${userId}/cardpacks/favorite/${cardpackId}`});
        } else {
          throw Boom.badRequest('Must provide userId and cardpackId query parameters');
        }
      }
    }
  ]);
};