import store from './store';
import { setGameState } from './store/modules/game';
import { setGameList } from './store/modules/games';
import { showStatusMessage } from './store/modules/global';

// TODO - Rewrite game server interface
/**
 * Creates a new game session
 * @param {string} gameName Name of new game
 * @param {number[]} cardpackIDs List of cardpacks to include in the game
 * @returns {Promise} Resolves to the new game state, or rejects if there is an error
 */
export const createGame = (name, maxPlayers, cardpackIDs) => {
  // if (maxPlayers < 4 || maxPlayers > 20) {
  //   let message = 'Max players must be between 4 and 20';
  //   store.dispatch(showStatusMessage(message));
  //   return Promise.reject(message);
  // }
  // if (!name) {
  //   let message = 'Game name cannot be blank';
  //   store.dispatch(showStatusMessage(message));
  //   return Promise.reject(message);
  // }
  // if (!cardpackIDs.length) {
  //   let message = 'Must select at least one cardpack';
  //   store.dispatch(showStatusMessage(message));
  //   return Promise.reject(message);
  // }
  // return axios.post('/game/create', {name, maxPlayers, cardpackIDs})
  //   .then((response) => {
  //     store.dispatch(setGameState(response.data));
  //     return response.data;
  //   })
  //   .catch((e) => {
  //     store.dispatch(showStatusMessage(e.response.data));
  //   });
};

export const startGame = () => {
  // return axios.post('/game/start')
  //   .then((response) => {
  //     store.dispatch(setGameState(response.data));
  //     return response.data;
  //   })
  //   .catch((e) => {
  //     store.dispatch(showStatusMessage(e.response.data));
  //   });
};

export const stopGame = () => {
  // return axios.post('/game/stop')
  //   .then((response) => {
  //     store.dispatch(setGameState(response.data));
  //     return response.data;
  //   })
  //   .catch((e) => {
  //     store.dispatch(showStatusMessage(e.response.data));
  //   });
};

/**
 * Adds user to the game with the given name
 * @param {string} gameName The game name
 */
export const joinGame = (gameName) => {
  // return axios.post('/game/join', gameName)
  //   .then((response) => {
  //     store.dispatch(setGameState(response.data));
  //     return response.data;
  //   })
  //   .catch((e) => {
  //     store.dispatch(showStatusMessage(e.response.data));
  //   });
};

/**
 * Leaves the current game
 */
export const leaveGame = () => {
  // return axios.post('/game/leave')
  //   .then((response) => {
  //     store.dispatch(setGameState(response.data));
  //     return response.data;
  //   })
  //   .catch((e) => {
  //     store.dispatch(showStatusMessage(e.response.data));
  //   });
};

/**
 * Fetches current game data
 * @returns {Promise} Resolves to game data
 */
export const getGameState = () => {
  // return axios.get('/game/state')
  //   .then((response) => {
  //     store.dispatch(setGameState(response.data));
  //     return response.data;
  //   })
  //   .catch((e) => {
  //     store.dispatch(showStatusMessage(e.response.data));
  //   });
};

/**
 * Fetches current game data
 * @returns {Promise} Resolves to game data
 */
export const getGameList = () => {
  // return axios.get('/gamelist')
  //   .then((response) => {
  //     store.dispatch(setGameList(response.data));
  //     return response.data;
  //   })
  //   .catch((e) => {
  //     store.dispatch(showStatusMessage(e.response.data));
  //   });
  return Promise.resolve([]);
};

/**
 * Plays a user's card if they are not the judge
 * @param {number} cardID The ID of the card to play
 * @returns {Promise} Resolves to an error (or null if it succeeded)
 */
export const playCard = (cardID) => {
  // return axios.post('/game/card', cardID);
};

/**
 * Kicks a player from the game if the kicker is the game owner
 * @param {number} playerID
 */
export const kickPlayer = (playerID) => {
  // return axios.post('/game/kickplayer', playerID);
};

/**
 * Used to vote a card for set of cards if you are the judge
 * @param {number} cardID The ID of the card (or one of the cards in a set)
 */
export const vote = (cardID) => {
  // return axios.post('/game/vote');
};