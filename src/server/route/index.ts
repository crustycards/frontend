import {Server} from '@hapi/hapi';
import authRoutes from './auth';
import cardRoutes from './card';
import gameRoutes from './game';
import searchRoutes from './search';
import userRoutes from './user';

export default (server: Server, options: {apiUrl: string, authUrl: string, gameUrl: string}) => {
  searchRoutes(server, options.apiUrl);
  cardRoutes(server, options.apiUrl);
  userRoutes(server, options.apiUrl);
  gameRoutes(server, options.gameUrl);
  authRoutes(server, options.authUrl);
};
