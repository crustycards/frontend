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
  createGame ({creator, gameName, cardpackIds, timeout = 20, maxPlayers = 8, handSize = 5}) {
    if (gameName === '') {
      return Promise.reject('Game name cannot be blank');
    }
    if (!gameName || gameName.constructor !== String) {
      return Promise.reject('Game name must be a string');
    }
    if (this.gamesByName[gameName]) {
      return Promise.reject('A game with this name already exists');
    }
    if (this.gamesByPlayerId[creator.id]) {
      return Promise.reject('User is already in a game');
    }

    // TODO - Write tests to check if hand size defaults to 5
    return helpers.getCardsFromCardpackIds(cardpackIds)
      .then((cards) => {
        let game = new Game(creator, cards.blackCards, cards.whiteCards, timeout, maxPlayers, handSize);
        // TODO - Push gamename to game constructor
        game.name = gameName;
        this.gamesByName[gameName] = game;
        this.namesByGame[game] = gameName;
        this.gamesByPlayerId[creator.id] = game;
        this.gamesByPlayerEmail[creator.email] = game;
        return game.get();
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
    // TODO - Write more thorough tests for this function
    let games = [];
    Object.values(this.gamesByName).forEach((currentGame) => {
      games.push(currentGame.get());
    });
    return games;
  }

  joinGame (user, gameName) {
    if (!this.gamesByName[gameName]) {
      throw new Error('Game does not exist');
    }
    if (this.gamesByPlayerEmail[user.email]) {
      throw new Error('You are already in a game');
    }
    if (!user || user.constructor !== Object || !user.email || !user.id) {
      throw new Error('User is invalid');
    }
    this.gamesByPlayerId[user.id] = this.gamesByName[gameName];
    this.gamesByPlayerEmail[user.email] = this.gamesByName[gameName];
    this.gamesByName[gameName].addUser(user);
    return {message: 'success'};
  }

  leaveGame (user) {
    if (!user || user.constructor !== Object || !user.email || !user.id) {
      throw new Error('User is invalid');
    }
    if (!this.gamesByPlayerId[user.id]) {
      throw new Error('User is not in a game');
    }
    this.gamesByPlayerId[user.id].removeUser(user);
    if (this.gamesByPlayerId[user.id].players.size() === 0) {
      let gameName = this.gamesByPlayerId[user.id].name;
      delete this.namesByGame[this.gamesByName[gameName]];
      delete this.gamesByName[gameName];
    }
    delete this.gamesByPlayerId[user.id];
    delete this.gamesByPlayerEmail[user.email];
  }

  // TODO - Test this function
  playCard (user, card) {
    let game = this.gamesByPlayerId[user.id];
    if (!game) {
      throw new Error('Cannot play a card when you are not in a game');
    } else {
      return game.playCard(user, card);
    }
  }

  getStateFor (user) {
    if (!user || user.constructor !== Object || !user.email || !user.id) {
      throw new Error('User is invalid');
    }
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