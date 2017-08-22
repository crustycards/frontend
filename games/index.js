let helpers = require('./helpers.js');

let gamesByName = {}; // Maps game names to their respective games
let gamesByPlayerId = {}; // Maps user IDs to the game they are in
let gamesByPlayerEmail = {}; // Maps user emails to the game they are in

// Returns a promise that will resolve to the new game
module.exports.createGame = (creator, gameName, cardpackIds, timeout = 20, maxPlayers = 8) => {
  if (!gameName || gameName.constructor !== String || gameName === '') {
    return new Promise((resolve, reject) => {
      reject(`Game name should be a non-empty string`);
    });
  }
  if (gamesByName[gameName]) {
    return new Promise((resolve, reject) => {
      reject(`Game with name '${gameName}' already exist`);
    });
  }

  // Create game
  helpers.getCardsFromCardpackIds(cardpackIds)
  .then((cards) => {
    let game = new Game(creator, cards.blackCards, cards.whiteCards, timeout, maxPlayers);
    gamesByName[gameName] = game;
    gamesByPlayerId[creator.id] = game;
    gamesByPlayerEmail[creator.email] = game;
    return game;
  })
};

module.exports.getUserGame = (user) => {
  if (user) {
    if (user.constructor === Object) {
      return gamesByPlayerId[user.id];
    }
    if (user.constructor === Number) {
      return gamesByPlayerId[user];
    }
    if (user.constructor === String) {
      return gamesByPlayerEmail[user];
    }
  }
  return null; // Returns this if user is invalid or if user is not in any game
};

module.exports.joinGame = (user, gameName) => {
  if (games[gameName]) {
    if (playerGame[user.email]) {
      // Player is already in a game
      module.exports.leaveGame(user);
    }
    gamesByPlayerId[user.id] = games[gameName];
    gamesByPlayerEmail[user.email] = games[gameName];
    games[gameName].users.addUser(user);
    return {message: 'success'};
  } else {
    return {error: 'Game does not exist'};
  }
};
module.exports.leaveGame = (user) => {
  gamesByPlayerId[user.id].users.removeUser(user);
  if (gamesByPlayerId[user.id].users.size === 0) {
    delete gamesByName[gamesByPlayerId[user.id].name];
  }
  delete gamesByPlayerId[user.id];
  delete gamesByPlayerEmail[user.email];
};

// module.exports.getGameStateFor = (user) => {
//   let game = module.exports.getGameUserIsIn(user);
//   if (game) {
//   }
//   return getGameStateFor(user);
// };