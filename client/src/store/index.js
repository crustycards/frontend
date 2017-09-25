import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSocketIoMiddleware from 'redux-socket.io';
import thunk from 'redux-thunk';
import rootReducer from './modules';
import io from 'socket.io-client';
const socket = io();
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');


const initialState = {
  ...window.__PRELOADED_STATE__,
  global: {
    ...window.__PRELOADED_STATE__.global,
    socket
  }
};
const enhancers = [];
const middleware = [
  thunk,
  socketIoMiddleware
];

// This block of code hooks up Redux DevTools if exists
const devToolsExtension = window.devToolsExtension;

if (typeof devToolsExtension === 'function') {
  enhancers.push(devToolsExtension());
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

/**
 * 
 * initialState,
 * composedEnhancers
 */ 
export default createStore(
  rootReducer,
  initialState,
  composedEnhancers
);
