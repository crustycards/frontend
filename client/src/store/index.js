import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSocketIoMiddleware from 'redux-socket.io';
import rootReducer from './modules';
import io from 'socket.io-client';
import { socket as gameSocket } from '../gameServerInterface';
const socket = io();
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');
const socketIoMiddlewareGame = createSocketIoMiddleware(gameSocket, 'gameserver/');

const initialState = {
  ...window.__PRELOADED_STATE__,
  global: {
    ...window.__PRELOADED_STATE__.global,
    socket,
    statusMessage: '',
    statusVisible: false
  }
};
const enhancers = [];
const middleware = [
  socketIoMiddleware,
  socketIoMiddlewareGame
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
