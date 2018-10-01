import {Server} from 'hapi';
import {ProxyResponseToolkit, Request} from '../model';

const getQuery = (query: string) => query ? `?query=${query}` : '';

export default (server: Server, apiUrl: string) => {
  server.route([
    {
      method: 'GET',
      path: '/api/cardpack/search',
      handler: (request: Request, h: ProxyResponseToolkit) => {
        const {query} = request.query;

        return h.proxy({
          uri: `${apiUrl}/cardpack/search${getQuery(query as string)}`
        });
      }
    },
    {
      method: 'GET',
      path: '/api/cardpack/search/autocomplete',
      handler: (request: Request, h: ProxyResponseToolkit) => {
        const {query} = request.query;

        return h.proxy({
          uri: `${apiUrl}/cardpack/search/autocomplete${getQuery(query as string)}`
        });
      }
    },
    {
      method: 'GET',
      path: '/api/user/search',
      handler: (request: Request, h: ProxyResponseToolkit) => {
        const {query} = request.query;

        return h.proxy({
          uri: `${apiUrl}/user/search${getQuery(query as string)}`
        });
      }
    },
    {
      method: 'GET',
      path: '/api/user/search/autocomplete',
      handler: (request: Request, h: ProxyResponseToolkit) => {
        const {query} = request.query;

        return h.proxy({
          uri: `${apiUrl}/user/search/autocomplete${getQuery(query as string)}`
        });
      }
    }
  ]);
};
