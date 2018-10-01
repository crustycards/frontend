import {Server} from "hapi";
import searchRoutes from './search';
import cardRoutes from './card';
import userRoutes from './user';
import gameRoutes from './game';
import authRoutes from './auth';

export default (server: Server, options: {apiUrl: string, authUrl: string, gameUrl: string}) => {
  searchRoutes(server, options.apiUrl);
  cardRoutes(server, options.apiUrl);
  userRoutes(server, options.apiUrl);
  gameRoutes(server, options.gameUrl);
  authRoutes(server, options.authUrl);
};