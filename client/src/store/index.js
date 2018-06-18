import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './modules';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

export const history = createBrowserHistory();
const enhancers = [applyMiddleware(routerMiddleware(history))];

// This block of code hooks up Redux DevTools if exists
const devToolsExtension = window.devToolsExtension;
if (typeof devToolsExtension === 'function') {
  enhancers.push(devToolsExtension());
}

const store = createStore(
  connectRouter(history)(rootReducer),
  compose(...enhancers)
);

export default store;