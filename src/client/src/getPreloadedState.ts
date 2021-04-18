import {User, UserSettings} from '../../../proto-gen-out/crusty_cards_api/model_pb';
import {deserializePreloadedState} from './helpers/proto';

declare global {
  interface Window {
    __PRELOADED_STATE__: string;
  }
}

const {
  user,
  userSettings
} = deserializePreloadedState(window.__PRELOADED_STATE__);

export const getPreloadedUser = (): User | undefined => {
  return user;
};

export const getPreloadedUserSettings = (): UserSettings | undefined => {
  return userSettings;
};
