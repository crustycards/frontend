import * as Boom from '@hapi/boom';
import {Server} from '@hapi/hapi';
import {ProxyResponseToolkit, Request} from '../model';

export default (server: Server, apiUrl: string) => {
  server.route([
    {
      method: 'GET',
      path: '/api/user/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/user/{id}`});
      }
    },
    {
      method: 'PATCH',
      path: '/api/user/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/user/{id}`});
      },
      options: {payload: {parse: false}}
    },
    {
      method: 'GET',
      path: '/api/user/friends/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/user/{id}/friends`});
      }
    },
    {
      method: 'GET',
      path: '/api/user/friends/requests/sent/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/user/{id}/friends/requests/sent`});
      }
    },
    {
      method: 'GET',
      path: '/api/user/friends/requests/received/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/user/{id}/friends/requests/received`});
      }
    },
    {
      method: ['PUT', 'DELETE'],
      path: '/api/user/friends',
      handler: (request: Request, h: ProxyResponseToolkit) => {
        const {userId, friendId} = request.query;

        if (userId === undefined || friendId === undefined) {
          throw Boom.badRequest('Must provide query parameters for userId and friendId');
        } else {
          return h.proxy({uri: `${apiUrl}/user/${userId}/friends/${friendId}`});
        }
      },
      options: {payload: {parse: false}}
    },
    {
      method: ['GET'],
      path: '/api/user/profileimage/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/user/{id}/profileimage`});
      }
    },
    {
      method: ['PUT'],
      path: '/api/user/profileimage/{id}',
      handler: (request, h: ProxyResponseToolkit) => {
        return h.proxy({uri: `${apiUrl}/user/{id}/profileimage`});
      },
      options: {payload: {parse: false}}
    }
  ]);
};
