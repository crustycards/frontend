const Game = require('./Game');
const helpers = require('./helpers');

class Games {
  constructor () {
    this.gamesByName = {}; // Maps game names to their respective games
    this.namesByGame = {}; // Maps games to their respective names
    this.gamesByPlayerId = {}; // Maps user IDs to the game they are in
    this.gamesByPlayerEmail = {}; // Maps user emails to the game they are in
  }

  // Returns a promise that will resolve to the new game
  createGame ({creator, gameName, cardpackIds, timeout = 20, maxPlayers = 8}) {
    if (gameName === '') {
      return new Promise((resolve, reject) => {
        reject('Game name cannot be blank');
      });
    }
    if (!gameName || gameName.constructor !== String) {
      return new Promise((resolve, reject) => {
        reject('Game name must be a string');
      });
    }
    if (this.gamesByName[gameName]) {
      return new Promise((resolve, reject) => {
        reject('A game with this name already exists');
      });
    }

    return helpers.getCardsFromCardpackIds(cardpackIds)
      .then((cards) => {
        let game = new Game(creator, cards.blackCards, cards.whiteCards, timeout, maxPlayers);
        game.name = gameName;
        this.gamesByName[gameName] = game;
        this.namesByGame[game] = gameName;
        this.gamesByPlayerId[creator.id] = game;
        this.gamesByPlayerEmail[creator.email] = game;
        return game;
      });
  }

  getUserGame (user) {
    if (user) {
      if (user.constructor === Object) {
        return this.gamesByPlayerId[user.id] || null;
      }
      if (user.constructor === Number) {
        return this.gamesByPlayerId[user] || null;
      }
      if (user.constructor === String) {
        return this.gamesByPlayerEmail[user] || null;
      }
    }
  }

  getAll () {
    let games = [];
    this.gamesByName.forEach((game) => {
      games.push(game);
    });
    return games;
  }

  joinGame (user, gameName) {
    if (!this.games[gameName]) {
      throw new Error('Game does not exist');
    }
    if (this.gamesByPlayerEmail[user.email]) {
      throw new Error('You are already in a game');
    }
    this.gamesByPlayerId[user.id] = games[gameName];
    this.gamesByPlayerEmail[user.email] = games[gameName];
    this.games[gameName].addUser(user);
    return {message: 'success'};
  }

  leaveGame (user) {
    this.gamesByPlayerId[user.id].removeUser(user);
    if (this.gamesByPlayerId[user.id].users.size() === 0) {
      let gameName = this.gamesByPlayerId[user.id].name;
      delete this.namesByGame[gamesByName[gameName]];
      delete this.gamesByName[gameName];
    }
    delete this.gamesByPlayerId[user.id];
    delete this.gamesByPlayerEmail[user.email];
  }

  getStateFor (user) {
    let game = this.getUserGame(user);
    if (!game) {
      throw new Error('You are not in a game');
    }
    let state = game.getState(user);
    state.gameName = this.namesByGame[game];
    return state;
  }
}

module.exports = Games;