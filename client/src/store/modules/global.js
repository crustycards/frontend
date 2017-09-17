export const SET_CURRENT_USER = 'global/SET_CURRENT_USER';
export const ADD_CARDPACK = 'global/ADD_CARDPACK';
export const REMOVE_CARDPACK = 'global/REMOVE_CARDPACK';

const initialState = {
  currentUser: null,
  cardpacks: []
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