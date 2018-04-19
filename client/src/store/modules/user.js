export const SET_CURRENT_USER = 'user/SET_CURRENT_USER';
export const ADD_CARDPACK = 'user/ADD_CARDPACK';
export const REMOVE_CARDPACK = 'user/REMOVE_CARDPACK';
export const ADD_FRIEND = 'user/ADD_FRIEND';
export const REMOVE_FRIEND = 'user/REMOVE_FRIEND';
export const ADD_SENT_FRIEND_REQUEST = 'user/ADD_SENT_FRIEND_REQUEST';
export const ADD_RECEIVED_FRIEND_REQUEST = 'user/ADD_RECEIVED_FRIEND_REQUEST';
export const SET_FRIENDS = 'user/SET_FRIENDS';

const preloadedState = window.__PRELOADED_STATE__;

const initialState = {
  currentUser: preloadedState.currentUser,
  cardpacks: preloadedState.cardpacks,
  friends: preloadedState.friends,
  requestsSent: preloadedState.requestsSent,
  requestsReceived: preloadedState.requestsReceived
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
  case ADD_FRIEND:
    return {
      ...state,
      friends: state.friends.concat([payload]),
      requestsSent: state.requestsSent.filter(user => user.id !== payload),
      requestsReceived: state.requestsReceived.filter(user => user.id !== payload)
    };

  case SET_FRIENDS:
    return {
      ...state,
      friends: payload
    };

  case ADD_SENT_FRIEND_REQUEST:
    return {
      ...state,
      requestsSent: state.requestsSent.concat(payload)
    };

  case ADD_RECEIVED_FRIEND_REQUEST:
    return {
      ...state,
      requestsReceived: state.requestsReceived.concat(payload)
    };

  case REMOVE_FRIEND:
    return {
      ...state,
      friends: state.friends.filter(user => user.id !== payload),
      requestsSent: state.requestsSent.filter(user => user.id !== payload),
      requestsReceived: state.requestsReceived.filter(user => user.id !== payload)
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

export const addFriend = payload => {
  return {
    type: ADD_FRIEND,
    payload
  };
};

export const addFriendRequestSent = payload => {
  return {
    type: ADD_SENT_FRIEND_REQUEST,
    payload
  };
};

export const addFriendRequestReceived = payload => {
  return {
    type: ADD_RECEIVED_FRIEND_REQUEST,
    payload
  };
};

export const removeFriend = payload => ({
  type: REMOVE_FRIEND,
  payload
});