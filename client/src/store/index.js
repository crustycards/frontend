import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
// import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk';
import rootReducer from './modules';

import { createEpicMiddleware } from 'redux-observable';

const pingEpic = () => {};

const epicMiddleware = createEpicMiddleware(pingEpic);

const initialState = {};
const enhancers = [];
const middleware = [
  thunk
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
