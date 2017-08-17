const db = require('../database');

let games = {}; // Maps game names to their respective games
let playerGame = {}; // Maps users to the game they are in

// Returns a promise that will resolve to the new game
module.exports.createGame = (creator, gameName, cardpacks, timeout = 20, maxPlayers = 8) => {
  if (!gameName || gameName.constructor !== String || gameName === '') {
    return new Promise((resolve, reject) => {
      reject(`Expected a non-empty string as game name, but instead got '${gameName}'`);
    });
  }
  if (games[gameName]) {
    return new Promise((resolve, reject) => {
      reject(`Game with name '${gameName}' already exist`);
    });
  }

  let cardpackPromises = [];
  let blackCards = [];
  let whiteCards = [];
  // Fetch all cards from cardpacks
  for (let i = 0; i < cardpacks.length; i++) {
    cardpackPromises.push(
      db.getCards(cardpacks[i].id)
      .then((cards) => {
        for (let j = 0; j < cards.length; j++) {
          if (cards[i].type === 'white') {
            whiteCards.push(cards[i]);
          } else {
            blackCards.push(cards[i]);
          }
        }
      })
    );
  }
  return Promise.all(cardpackPromises)
  // Create game
  .then(() => {
    let game = new Game(creator, blackCards, whiteCards, timeout, maxPlayers);
    playerGame[creator.email] = game;
    games[gameName] = game;
    return game;
  })
};

module.exports.getGameUserIsIn = (user) => {
  return playerGame[user.email] || null;
};

module.exports.joinGame = (user, gameName) => {
  if (games[gameName]) {
    if (playerGame[user.email]) {
      // Player is already in a game
      module.exports.leaveGame(user);
    }
    playerGame[user.email] = games[gameName];
    games[gameName].users.addUser(user);
  } else {
    return {error: 'Game does not exist'};
  }
};
module.exports.leaveGame = (user) => {
  delete playerGame[user.email];
};

module.exports.getGameStateFor = (user) => {
  let game = module.exports.getGameUserIsIn(user);
  if (game) {
  }
  return getGameStateFor(user);
};