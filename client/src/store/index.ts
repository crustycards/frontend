import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './modules';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {User, WhiteCard, BlackCard} from '../api/dao';
import {History} from '../../../node_modules/@types/history';

declare global {
  interface Window {
    devToolsExtension?: any
  }
}

interface CreateStore {
  history: History
  preloadedState?: any
}

export default ({history, preloadedState = {}}: CreateStore) => {
  const enhancers = [applyMiddleware(routerMiddleware(history))];

  // This block of code hooks up Redux DevTools if exists
  const devToolsExtension = window.devToolsExtension;
  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }

  return createStore(
    connectRouter(history)(rootReducer),
    preloadedState,
    compose(...enhancers)
  );
};

interface HasPlayed {
  whitePlayed: Map<string, Array<WhiteCard>>
  currentBlackCard: BlackCard
  user: User
}

interface CanPlay extends HasPlayed {
  judgeId: string
}

export const hasPlayed = ({whitePlayed, currentBlackCard, user}: HasPlayed) => {
  return !!(
    whitePlayed &&
    whitePlayed.has(user.id) &&
    currentBlackCard &&
    whitePlayed.get(user.id).length === currentBlackCard.answerFields
  );
};

export const canPlay = ({whitePlayed, currentBlackCard, user, judgeId}: CanPlay) => {
  if (hasPlayed({whitePlayed, currentBlackCard, user})) {
    return false;
  }

  const userId = user.id;

  if (!currentBlackCard) {
    return false;
  }

  return userId !== judgeId;
};
