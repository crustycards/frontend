let helpers = require('./helpers.js');

let gamesByName = {}; // Maps game names to their respective games
let gamesByPlayerId = {}; // Maps user IDs to the game they are in
let gamesByPlayerEmail = {}; // Maps user emails to the game they are in

// Returns a promise that will resolve to the new game
module.exports.createGame = (creator, gameName, cardpackIds, timeout = 20, maxPlayers = 8) => {
  if (!gameName || gameName.constructor !== String) {
    throw new Error('Game name must be a string');
  }
  if (gameName === '') {
    throw new Error('Game name cannot be blank');
  }
  if (gamesByName[gameName]) {
    throw new Error('A game with this name already exists');
  }

  return helpers.getCardsFromCardpackIds(cardpackIds)
    .then((cards) => {
      let game = new Game(creator, cards.blackCards, cards.whiteCards, timeout, maxPlayers);
      gamesByName[gameName] = game;
      gamesByPlayerId[creator.id] = game;
      gamesByPlayerEmail[creator.email] = game;
      return game;
    });
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
};

module.exports.joinGame = (user, gameName) => {
  if (!games[gameName]) {
    throw new Error('Game does not exist');
  }
  if (playerGame[user.email]) {
    throw new Error('You are already in a game');
  }
  gamesByPlayerId[user.id] = games[gameName];
  gamesByPlayerEmail[user.email] = games[gameName];
  games[gameName].addUser(user);
  return {message: 'success'};
};
module.exports.leaveGame = (user) => {
  gamesByPlayerId[user.id].removeUser(user);
  if (gamesByPlayerId[user.id].users.size() === 0) {
    delete gamesByName[gamesByPlayerId[user.id].name];
  }
  delete gamesByPlayerId[user.id];
  delete gamesByPlayerEmail[user.email];
};

module.exports.getGameStateFor = (user) => {
  let game = module.exports.getGameUserIsIn(user);
  if (!game) {
    throw new Error('You are not in a game');
  }
  return game.getState(user);
};