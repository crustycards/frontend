export const SET_CURRENT_USER = 'global/SET_CURRENT_USER';

const initialState = {
  currentUser: null
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_CURRENT_USER: 
      return {
        ...state,
        currentUser: payload
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