import {routerMiddleware} from 'connected-react-router';
import {History} from 'history';
import {applyMiddleware, compose, createStore} from 'redux';
import {User} from '../../../../proto-gen-out/api/model_pb';
import {GameView} from '../../../../proto-gen-out/game/game_service_pb';
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

// The Typescript type of the entire Redux state
export type StoreState = ReturnType<ReturnType<typeof createRootReducer>>;

export const hasPlayed = (user: User, view: GameView): boolean => {
  if (!view.hasCurrentBlackCard() || !user) {
    return false;
  }

  const userEntry = view.getWhitePlayedList().find((entry) => {
    return entry.getPlayer()?.getUser()?.getName() === user.getName();
  });

  if (!userEntry) {
    return false;
  }

  return userEntry.getCardTextsList().length ===
    view.getCurrentBlackCard()?.getAnswerFields();
};

export const canPlay = (view: GameView, user: User) => {
  return !hasPlayed(user, view)
      && view.hasCurrentBlackCard()
      && view.getStage() === GameView.Stage.PLAY_PHASE
      && user
      && view.hasJudge()
      && user.getName() !== view.getJudge()?.getName();
};
