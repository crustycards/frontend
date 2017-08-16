const initState = {
  currentUser: null,
  friends: [],
  requestsSent: [],
  requestsReceived: []
}

/**
 * Reducer function that handles the mutation of the state.
 * If not state is given, initial state is used.
 * 
 * @param {Object} state - Object representing the state of the
 *   application. 
 * @param {Object} Action - Object representing the action that 
 *   mutates the state of the application. 
 */
export default (state = initState, action) => {
  switch (action.type) {
    case 'INIT':
      return initState;
      break;
    case 'SIGN_IN':
      console.log('sign in', action.payload.currentUser);
      return state.currentUser = action.payload.currentUser;
      break;
    case 'ADD_FRIENDS':
      console.log('add friends', action.payload);
      state.friends = state.friends || [];
      return state.friends.concat(action.payload);
      break;
    case 'ADD_REQUESTS_SENT':
      console.log('REQUESTS_SENT', action.payload);
      state.requestsSent = state.requestsSent || [];
      return state.requestsSent.concat(action.payload);
      break;
    case 'REMOVE_REQUESTS_SENT':
      console.log('REQUESTS_SENT', action.payload);
      return state.requestsSent
        .filter(request => request.email !== action.payload.email);
      break;
    case 'ADD_REQUESTS_RECEIVED':
      console.log('REQUESTS_RECEIVED', action.payload);
      state.requestsReceived = state.requestsReceived || [];
      return state.requestsReceived.concat(action.payload);
      break;
    case 'REMOVE_REQUESTS_RECEIVED':
      console.log('REQUESTS_RECEIVED', action.payload);
      return state.requestsReceived
        .filter(request => request.email !== action.payload.email);
      break;
    case 'REMOVE_FRIEND':
      console.log('REMOVE_FRIEND', action.payload);
      return state.requestsReceived
        .filter(request => request.email !== action.payload.email);
      break;
    default:
      return state;
  }
}