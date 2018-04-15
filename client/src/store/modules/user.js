export const SET_CURRENT_USER = 'user/SET_CURRENT_USER';
export const ADD_CARDPACK = 'user/ADD_CARDPACK';
export const REMOVE_CARDPACK = 'user/REMOVE_CARDPACK';

const preloadedState = window.__PRELOADED_STATE__;

const initialState = {
  currentUser: preloadedState.currentUser,
  cardpacks: preloadedState.cardpacks
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