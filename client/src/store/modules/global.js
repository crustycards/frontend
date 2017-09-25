export const SET_CURRENT_USER = 'global/SET_CURRENT_USER';
export const ADD_CARDPACK = 'global/ADD_CARDPACK';
export const REMOVE_CARDPACK = 'global/REMOVE_CARDPACK';
export const OPEN_NAVBAR = 'global/OPEN_NAVBAR';
export const CLOSE_NAVBAR = 'global/CLOSE_NAVBAR';
export const TOGGLE_NAVBAR = 'global/TOGGLE_NAVBAR';
export const SET_NAVBAR = 'global/SET_NAVBAR';

const initialState = {
  currentUser: null,
  cardpacks: [],
  navbarOpen: false
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_CURRENT_USER: 
      return {
        ...state,
        currentUser: payload
      };
    case ADD_CARDPACK: 
      return {
        ...state,
        cardpacks: state.cardpacks.concat(payload)
      };
    case REMOVE_CARDPACK: 
      return {
        ...state,
        cardpacks: state.cardpacks.filter(cardpack => cardpack.id !== payload)
      };
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
    case TOGGLE_NAVBAR:
      return {
        ...state,
        navbarOpen: !state.navbarOpen
      };
    case SET_NAVBAR:
      return {
        ...state,
        navbarOpen: !!payload
      };
  
    default: 
      return state;
  }
};

export const setCurrentUser = payload => {
  return {
    type: SET_CURRENT_USER,
    payload
  };
};

export const addCardpack = payload => {
  return {
    type: ADD_CARDPACK,
    payload
  };
};

export const removeCardpack = payload => {
  return {
    type: REMOVE_CARDPACK,
    payload
  };
};

export const openNavbar = payload => {
  return {
    type: OPEN_NAVBAR
  };
};

export const closeNavbar = payload => {
  return {
    type: CLOSE_NAVBAR
  };
};

export const toggleNavbar = payload => {
  return {
    type: TOGGLE_NAVBAR
  };
};

export const setNavbar = payload => {
  return {
    type: SET_NAVBAR
  };
};