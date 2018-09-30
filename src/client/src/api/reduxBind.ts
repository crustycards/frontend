import GameApi from './model/gameApi';
import {Store} from 'redux';
import {setGameList} from '../store/modules/games';
import {setGameState} from '../store/modules/game';

export const bindGameApi = (gameApi: GameApi, store: Store) => {
  const createGame = gameApi.createGame;
  gameApi.createGame = (...args) => createGame(...args).then((gameState) => {
    store.dispatch(setGameState(gameState));

    return gameState;
  });

  const startGame = gameApi.startGame;
  gameApi.startGame = () => startGame().then((gameState) => {
    store.dispatch(setGameState(gameState));

    return gameState;
  });

  const stopGame = gameApi.stopGame;
  gameApi.stopGame = () => stopGame().then((gameState) => {
    store.dispatch(setGameState(gameState));

    return gameState;
  });

  const joinGame = gameApi.joinGame;
  gameApi.joinGame = (...args) => joinGame(...args).then((gameState) => {
    store.dispatch(setGameState(gameState));

    return gameState;
  });

  const getGameState = gameApi.getGameState;
  gameApi.getGameState = () => getGameState().then((gameState) => {
    store.dispatch(setGameState(gameState));

    return gameState;
  });

  const getGameList = gameApi.getGameList;
  gameApi.getGameList = () => getGameList().then((games) => {
    store.dispatch(setGameList(games));

    return games;
  });

  const sendMessage = gameApi.sendMessage;
  gameApi.sendMessage = (...args) => sendMessage(...args).then((gameState) => {
    store.dispatch(setGameState(gameState));

    return gameState;
  });
};