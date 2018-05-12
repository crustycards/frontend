import store from './store';
import { setGameState } from './store/modules/game';
import { setGameList } from './store/modules/games';
import { showStatusMessage } from './store/modules/global';
import axios from 'axios';

const { gameServerURL } = window.__PRELOADED_DATA__;

const user = store.getState().user.currentUser;

const gameApi = axios.create({
  baseURL: gameServerURL,
  timeout: 1000,
  withCredentials: true
});

/**
 * Creates a new game session
 * @param {string} gameName Name of new game
 * @param {number} maxPlayers
 * @param {number[]} cardpackIds List of cardpacks to include in the game
 * @returns {Promise} Resolves to the new game state, or rejects if there is an error
 */
export const createGame = (gameName, maxPlayers, cardpackIds) => {
  if (maxPlayers < 4 || maxPlayers > 20) {
    let message = 'Max players must be between 4 and 20';
    store.dispatch(showStatusMessage(message));
    return Promise.reject(message);
  }
  if (!gameName) {
    let message = 'Game name cannot be blank';
    store.dispatch(showStatusMessage(message));
    return Promise.reject(message);
  }
  if (!cardpackIds.length) {
    let message = 'Must select at least one cardpack';
    store.dispatch(showStatusMessage(message));
    return Promise.reject(message);
  }
  return gameApi.post(`${user.id}/game/create`, {gameName, maxPlayers, cardpackIds})
    .then((response) => {
      store.dispatch(setGameState(response.data));
      return response.data;
    })
    .catch((e) => {
      store.dispatch(showStatusMessage(e.response.data));
    });
};

export const startGame = () => {
  return gameApi.post(`${user.id}/game/start`)
    .then((response) => {
      store.dispatch(setGameState(response.data));
      return response.data;
    })
    .catch((e) => {
      store.dispatch(showStatusMessage(e.response.data));
    });
};

export const stopGame = () => {
  return gameApi.post(`/${user.id}/game/stop`)
    .then((response) => {
      store.dispatch(setGameState(response.data));
      return response.data;
    })
    .catch((e) => {
      store.dispatch(showStatusMessage(e.response.data));
    });
};

/**
 * Adds user to the game with the given name
 * @param {string} gameName The game name
 */
export const joinGame = (gameName) => {
  return gameApi.post(`/${user.id}/game/${gameName}/join`, gameName)
    .catch((e) => {
      store.dispatch(showStatusMessage(e.response.data));
    })
    .then((response) => {
      store.dispatch(setGameState(response.data));
      return response.data;
    });
};

/**
 * Leaves the current game
 */
export const leaveGame = () => {
  return gameApi.delete(`/${user.id}/game`)
    .then((response) => {
      store.dispatch(setGameState(null));
      return response.data;
    })
    .catch((e) => {
      store.dispatch(showStatusMessage(e.response.data));
    });
};

/**
 * Fetches current game data
 * @returns {Promise} Resolves to game data
 */
export const getGameState = () => {
  return gameApi.get(`/${user.id}/game`)
    .catch((e) => {
      store.dispatch(showStatusMessage(e.response.data));
    })
    .then((response) => {
      store.dispatch(setGameState(response.data));
      return response.data;
    });
};

/**
 * Fetches current game data
 * @returns {Promise} Resolves to game data
 */
export const getGameList = () => {
  return gameApi.get('/games')
    .then((response) => {
      store.dispatch(setGameList(response.data));
      return response.data;
    });
};

/**
 * Plays a user's card if they are not the judge
 * @param {number} cardID The ID of the card to play
 * @returns {Promise} Resolves to an error (or null if it succeeded)
 */
export const playCard = (cardId) => {
  return gameApi.put(`/${user.id}/game/play/${cardId}`).then(() => {});
};

/**
 * Kicks a player from the game if the kicker is the game owner
 * @param {number} playerID
 */
export const kickPlayer = (playerId) => {
  return gameApi.delete(`${user.id}/game/players/${playerId}`).then(() => {});
};

/**
 * Used to vote a card for set of cards if you are the judge
 * @param {number} cardID The ID of the card (or one of the cards in a set)
 */
export const vote = (cardId) => {
  return gameApi.put(`${user.id}/game/vote/${cardId}`).then(() => {});
};