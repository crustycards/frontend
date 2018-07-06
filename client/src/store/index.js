import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './modules';
import {createBrowserHistory} from 'history';
import {connectRouter, routerMiddleware} from 'connected-react-router';

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

export const hasPlayed = ({whitePlayed, currentBlackCard, currentUser}) => {
  return !!(
    whitePlayed &&
    whitePlayed[currentUser.id] &&
    currentBlackCard &&
    whitePlayed[currentUser.id].length === currentBlackCard.answerFields
  );
};

export const canPlay = ({whitePlayed, currentBlackCard, currentUser, judgeId}) => {
  if (hasPlayed({whitePlayed, currentBlackCard, currentUser})) {
    return false;
  }

  const currentUserId = currentUser.id;

  if (!currentBlackCard) {
    return false;
  }

  return currentUserId !== judgeId;
};
