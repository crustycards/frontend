import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
// import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk';
import rootReducer from './modules';

/**
 * 
 * initialState,
 * composedEnhancers
 */ 
const store = createStore(
  rootReducer
);

export default store;