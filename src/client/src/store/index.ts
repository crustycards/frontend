import {routerMiddleware} from 'connected-react-router';
import {History} from 'history';
import {applyMiddleware, compose, createStore} from 'redux';
import {BlackCard, User, WhitePlayedEntry} from '../api/dao';
import createRootReducer from './modules';

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
    createRootReducer(history),
    preloadedState,
    compose(...enhancers)
  );
};

interface HasPlayed {
  whitePlayed?: WhitePlayedEntry[];
  currentBlackCard?: BlackCard;
  user?: User;
}

interface CanPlay extends HasPlayed {
  judgeId: string;
}

// The Typescript type of the entire Redux state
export type StoreState = ReturnType<ReturnType<typeof createRootReducer>>;

export const hasPlayed = ({whitePlayed, currentBlackCard, user}: HasPlayed) => {
  return !!(
    whitePlayed &&
    user &&
    whitePlayed.find((entry) => entry.player.user && entry.player.user.id === user.id) &&
    currentBlackCard &&
    whitePlayed.find((entry) => (
      entry.player.user && entry.player.user.id === user.id
    )).cards.length === currentBlackCard.answerFields
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
