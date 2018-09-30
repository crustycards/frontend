import { User } from '../../api/dao';

const OPEN_NAVBAR = 'global/OPEN_NAVBAR';
const CLOSE_NAVBAR = 'global/CLOSE_NAVBAR';
const SET_NAVBAR = 'global/SET_NAVBAR';
const SHOW_STATUS_MESSAGE = 'global/SHOW_STATUS_MESSAGE';
const HIDE_STATUS_MESSAGE = 'global/HIDE_STATUS_MESSAGE';

const preloadedState = window.__PRELOADED_STATE__;

interface ReduxGlobalState {
  user: User
  navbarOpen: boolean
  statusMessage: string
  statusVisible: boolean
}

const initialState: ReduxGlobalState = {
  user: preloadedState ? preloadedState.user : null,
  navbarOpen: false,
  statusMessage: '',
  statusVisible: false
};

export default (state: ReduxGlobalState = initialState, {type, payload}: {type: string, payload: any}): ReduxGlobalState => {
  switch (type) {
    case OPEN_NAVBAR:
      return {
        ...state,
        navbarOpen: true
      };
    case CLOSE_NAVBAR:
      return {
        ...state,
        navbarOpen: false
      };
    case SET_NAVBAR:
      return {
        ...state,
        navbarOpen: !!payload
      };
    case SHOW_STATUS_MESSAGE:
      return {
        ...state,
        statusMessage: payload,
        statusVisible: true
      };
    case HIDE_STATUS_MESSAGE:
      return {
        ...state,
        statusVisible: false
      };

    default:
      return state;
  }
};

export const openNavbar = () => {
  return {
    type: OPEN_NAVBAR
  };
};

export const closeNavbar = () => {
  return {
    type: CLOSE_NAVBAR
  };
};

export const setNavbar = (isOpen: boolean) => {
  return {
    type: SET_NAVBAR,
    payload: isOpen
  };
};

export const showStatusMessage = (message: string) => {
  return {
    type: SHOW_STATUS_MESSAGE,
    payload: message
  };
};

export const hideStatusMessage = () => {
  return {
    type: HIDE_STATUS_MESSAGE
  };
};
