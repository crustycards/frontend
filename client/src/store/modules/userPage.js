export const CLEAR = 'userPage/CLEAR';
export const SET_FRIENDS = 'userPage/SET_FRIENDS';
export const SET_FRIEND_REQUESTS_SENT = 'userPage/SET_FRIEND_REQUESTS_SENT';
export const SET_FRIEND_REQUESTS_RECEIVED = 'userPage/SET_FRIEND_REQUESTS_RECEIVED';
export const SET_CARDPACK_NAMES = 'userPage/SET_CARDPACK_NAMES';

const initialState = {
  friends: [],
  friendRequestsSent: [],
  friendRequestsReceived: [],
  cardpackNames: []
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case CLEAR:
      return initialState;
      case SET_FRIENDS:
      return {
        ...state,
        friends: payload
      };
    case SET_FRIEND_REQUESTS_SENT:
      return {
        ...state,
        friendRequestsSent: payload
      };
    case SET_FRIEND_REQUESTS_RECEIVED:
      return {
        ...state,
        friendRequestsReceived: payload
      };
    case SET_CARDPACK_NAMES:
      return {
        ...state,
        cardpackNames: payload
      };

    default:
      return state;
  }
};

export const clear = () => {
  return {
    type: CLEAR
  };
};

export const setFriends = (payload) => {
  return {
    type: SET_FRIENDS,
    payload
  };
};

export const setFriendRequestsSent = (payload) => {
  return {
    type: SET_FRIEND_REQUESTS_SENT,
    payload
  };
};

export const setFriendRequestsReceived = (payload) => {
  return {
    type: SET_FRIEND_REQUESTS_RECEIVED,
    payload
  };
};

export const setCardpackNames = (payload) => {
  return {
    type: SET_CARDPACK_NAMES,
    payload
  };
};
