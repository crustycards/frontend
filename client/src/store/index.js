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

export const hasPlayed = () => {
  const state = store.getState();

  const {
    whitePlayed,
    currentBlackCard
  } = state.game;

  const currentUserId = state.user.currentUser.id;

  return !!(
    whitePlayed &&
    whitePlayed[currentUserId] &&
    currentBlackCard &&
    whitePlayed[currentUserId].length === currentBlackCard.answerFields
  );
};

export const canPlay = () => {
  if (hasPlayed()) {
    return false;
  }

  const state = store.getState();

  const currentUserId = state.user.currentUser.id;
  const {judgeId, currentBlackCard} = state.game;

  if (!currentBlackCard) {
    return false;
  }

  return currentUserId !== judgeId;
};
