import store from './store';
import {setGameState} from './store/modules/game';
import {setGameList} from './store/modules/games';
import {showStatusMessage} from './store/modules/global';
import axios from 'axios';
import queryString from 'query-string';

const user = store.getState().user.currentUser;

/**
 * Creates a new game session
 * @param {string} gameName Name of new game
 * @param {number} maxPlayers
 * @param {number} maxScore
 * @param {number} handSize
 * @param {number[]} cardpackIds List of cardpacks to include in the game
 * @return {Promise} Resolves to the new game state, or rejects if there is an error
 */
export const createGame = (gameName, maxPlayers, maxScore, handSize, cardpackIds) => {
  if (maxPlayers < 4 || maxPlayers > 20) {
    let message = 'Max players must be between 4 and 20';
    store.dispatch(showStatusMessage(message));
    return Promise.reject(message);
  }
  if (maxScore < 4 || maxScore > 20) {
    let message = 'Max score must be between 4 and 20';
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
  return axios.post(`/api/game/create/${user.id}`, {gameName, maxPlayers, maxScore, handSize, cardpackIds})
    .then((response) => {
      store.dispatch(setGameState(response.data));
      return response.data;
    });
};

export const startGame = () => {
  return axios.post(`/api/game/start/${user.id}`)
    .then((response) => {
      store.dispatch(setGameState(response.data));
      return response.data;
    });
};

export const stopGame = () => {
  return axios.post(`/api/game/stop/${user.id}`)
    .then((response) => {
      store.dispatch(setGameState(response.data));
      return response.data;
    });
};

/**
 * Adds user to the game with the given name
 * @param {string} gameName The game name
 * @return {Promise}
 */
export const joinGame = (gameName) => {
  return axios.post(`/api/game/join/${user.id}?${queryString.stringify({gameName})}`)
    .then((response) => {
      store.dispatch(setGameState(response.data));
      return response.data;
    });
};

/**
 * Leaves the current game
 * @return {Promise}
 */
export const leaveGame = () => {
  return axios.delete(`/api/game/players/${user.id}`)
    .then((response) => {
      store.dispatch(setGameState(null));
      return response.data;
    });
};

/**
 * Fetches current game data
 * @return {Promise} Resolves to game data
 */
export const getGameState = () => {
  return axios.get(`/api/game/${user.id}`)
    .then((response) => {
      store.dispatch(setGameState(response.data || null));
      return response.data;
    });
};

/**
 * Fetches current game data
 * @return {Promise} Resolves to game data
 */
export const getGameList = () => {
  return axios.get('/api/games')
    .then((response) => {
      store.dispatch(setGameList(response.data));
      return response.data;
    });
};

/**
 * Plays a user's card if they are not the judge
 * @param {number[]} cardIds The ids of the cards to play
 * @return {Promise} Resolves to an error (or null if it succeeded)
 */
export const playCards = (cardIds) => {
  return axios.put(`/api/game/play/${user.id}`, cardIds).then(() => {});
};

/**
 * Kicks a player from the game if the kicker is the game owner
 * @param {number} playerId
 * @return {Promise} Resolves to undefined when the operation has completed
 */
export const kickPlayer = (playerId) => {
  return axios.delete(`/api/game/players?${queryString.stringify({
    kickerId: user.id,
    kickeeId: playerId
  })}`).then(() => {});
};

/**
 * Used to vote a card for set of cards if you are the judge
 * @param {number} cardId The ID of the card (or one of the cards in a set)
 * @return {Promise} Resolves to undefined when the operation has completed
 */
export const vote = (cardId) => {
  return axios.put(`/api/game/vote/${user.id}?${queryString.stringify({cardId})}`).then(() => {});
};

/**
 * Starts next round of the game
 * @return {Promise} Resolves to undefined when the operation has completed
 */
export const startNextRound = () => {
  return axios.put(`/api/game/continue/${user.id}`).then(() => {});
};

export const sendMessage = (message) => {
  return axios.put(`/api/game/messages/${user.id}`, message, {headers: {'Content-Type': 'text/plain'}})
    .then((response) => {
      store.dispatch(setGameState(response.data));
      return response.data;
    });
};
