import {createContext} from 'react';
import {useContext} from 'react';
import {GameService} from './gameService';
import {UserService} from './userService';

interface Services {
  gameService?: GameService;
  userService: UserService;
}

const Context = createContext<Services>({userService: new UserService()});

export const Provider = Context.Provider;
export const Consumer = Context.Consumer;

// Returns undefined if user is not logged in.
export const useGameService = (): GameService | undefined => {
  return useContext(Context).gameService;
};

export const useUserService = (): UserService => {
  return useContext(Context).userService;
};
