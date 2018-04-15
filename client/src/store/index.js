import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './modules';

const enhancers = [];

// This block of code hooks up Redux DevTools if exists
const devToolsExtension = window.devToolsExtension;
if (typeof devToolsExtension === 'function') {
  enhancers.push(devToolsExtension());
}

const composedEnhancers = compose(...enhancers);

/**
 * 
 * initialState,
 * composedEnhancers
 */ 
export default createStore(
  rootReducer,
  composedEnhancers
);