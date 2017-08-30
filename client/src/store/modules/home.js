import React, {Component} from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const ADD_FRIEND = 'home/ADD_FRIEND';
const REMOVE_FRIEND = 'home/REMOVE_FRIEND';
const ADD_SENT_FRIEND_REQUEST = 'home/ADD_SENT_FRIEND_REQUEST';
const ADD_RECEIVED_FRIEND_REQUEST = 'home/ADD_RECEIVED_FRIEND_REQUEST';
const REMOVE_SENT_FRIEND_REQUEST = 'home/REMOVE_SENT_FRIEND_REQUEST';
const REMOVE_RECEIVED_FRIEND_REQUEST = 'home/REMOVE_RECEIVED_FRIEND_REQUEST';
const SET_CURRENT_USER = 'home/SET_CURRENT_USER';
const SET_FRIENDS = 'home/SET_FRIENDS';

const initialState = {
  currentUser: null,
  friends: [],
  requestsSent: [],
  requestsReceived: [],
};

/**
 * Main application reducer. Accepts a state and action object.
 * TODO: split up
 */
export default (state = initialState, {type, payload}) => {
  switch (type) {
  case SET_CURRENT_USER: 
    return {
      ...state,
      currentUser: payload
    };

  case ADD_FRIEND: 
    return {
      ...state,
      friends: state.friends.concat([payload])
    };

  case SET_FRIENDS: 
    console.log(payload);
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
    const newFriends = state.friends.filter(f => f.id !== payload.id);
    return {
      ...state,
      friends: newFriends
    };

  case REMOVE_SENT_FRIEND_REQUEST:
    const requestsSent = state.requestsSent.filter(f => f.id !== payload.id);
    return {
      ...state,
      requestsSent
    };

  case REMOVE_RECEIVED_FRIEND_REQUEST:
    const requestsReceived = state.requestsReceived.filter(f => f.id !== payload.id);
    return {
      ...state,
      requestsReceived
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

export const removeSentFriendRequest = payload => ({
  type: REMOVE_SENT_FRIEND_REQUEST,
  payload
});

export const removeReceivedFriendRequest = payload => ({
  type: REMOVE_RECEIVED_FRIEND_REQUEST,
  payload
});

export const requestCurrentUser = () => {
  return (dispatch, getState) => {
    axios.get('/api/currentuser')
      .then(({data}) => {
        dispatch({
          type: SET_CURRENT_USER,
          payload: data
        });
      });
  };
};

export const requestFriends = () => {
  return (dispatch, getState) => {
    axios.get('/api/friends')
      .then(({data}) => {
        console.log('response', data);
        dispatch({
          type: SET_FRIENDS,
          payload: data.friends, 
        });
        dispatch({
          type: ADD_SENT_FRIEND_REQUEST,
          payload: data.requestsSent, 
        });
        dispatch({
          type: ADD_RECEIVED_FRIEND_REQUEST,
          payload: data.requestsReceived, 
        });
      });
  };
};


//
//
// SOCKET Dispatchers
//
//
export const requestDispatcher = action$ => {
  console.log('action', action$);
};