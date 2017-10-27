import io from 'socket.io-client';
const gameServerURL = window.__PRELOADED_DATA__.gameURL;
export const socket = io(gameServerURL);


export const createGame = () => {};

export const joinGame = (gameName) => {};

export const leaveGame = () => {};

export const getGameList = () => {};

export const playCard = (cardID) => {};

export const kickPlayer = (playerID) => {};

export const votePlayer = (playerID) => {};