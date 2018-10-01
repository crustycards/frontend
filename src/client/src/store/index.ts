import {connectRouter, routerMiddleware} from 'connected-react-router';
import {History} from 'history';
import {applyMiddleware, compose, createStore} from 'redux';
import {BlackCard, User, WhitePlayed} from '../api/dao';
import rootReducer from './modules';

declare global {
  interface Window {
    devToolsExtension?: any;
  }
}

interface CreateStore {
  history: History;
  preloadedState?: any;
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
  whitePlayed?: WhitePlayed;
  currentBlackCard?: BlackCard;
  user?: User;
}

interface CanPlay extends HasPlayed {
  judgeId: string;
}

export const hasPlayed = ({whitePlayed, currentBlackCard, user}: HasPlayed) => {
  return !!(
    whitePlayed &&
    user &&
    whitePlayed[user.id] &&
    currentBlackCard &&
    whitePlayed[user.id].length === currentBlackCard.answerFields
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
