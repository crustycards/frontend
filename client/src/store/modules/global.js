export const OPEN_NAVBAR = 'global/OPEN_NAVBAR';
export const CLOSE_NAVBAR = 'global/CLOSE_NAVBAR';
export const SET_NAVBAR = 'global/SET_NAVBAR';
export const SHOW_STATUS_MESSAGE = 'global/SHOW_STATUS_MESSAGE';
export const HIDE_STATUS_MESSAGE = 'global/HIDE_STATUS_MESSAGE';

const preloadedState = window.__PRELOADED_STATE__;

const initialState = {
  user: preloadedState ? preloadedState.user : null,
  navbarOpen: false,
  statusMessage: '',
  statusVisible: false
};

export default (state = initialState, {type, payload}) => {
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

export const openNavbar = (payload) => {
  return {
    type: OPEN_NAVBAR
  };
};

export const closeNavbar = (payload) => {
  return {
    type: CLOSE_NAVBAR
  };
};

export const setNavbar = (payload) => {
  return {
    type: SET_NAVBAR,
    payload
  };
};

export const showStatusMessage = (payload) => {
  return {
    type: SHOW_STATUS_MESSAGE,
    payload
  };
};

export const hideStatusMessage = (payload) => {
  return {
    type: HIDE_STATUS_MESSAGE
  };
};
