const expect = require('chai').use(require('chai-as-promised')).expect;
const Games = require('../../games');

let users = [];
for (let i = 0; i < 50; i++) {
  users.push({
    id: i + 1,
    email: 'user' + i + '@gmail.com'
  });
}
let whiteCards = [];
for (let i = 0; i < 50; i++) {
  whiteCards.push({
    id: i + 1,
    name: 'white card ' + i
  });
}
let blackCards = [];
for (let i = 0; i < 50; i++) {
  blackCards.push({
    id: i + 1,
    name: 'black card ' + i
  });
}

describe('Games', () => {
  let games;
  beforeEach(() => {
    games = new Games();
  });
  describe('createGame()', () => {
    it('Should create a game will all valid parameters', () => {
      return games.createGame({
        creator: users[0],
        gameName: 'test game',
        cardpackIds: [],
        timeout: 30,
        maxPlayers: 8
      })
        .then((game) => {
          expect(game.name).to.equal('test game');
        });
    });
    it('Should reject when game name is invalid', () => {
      return expect(games.createGame({
        creator: users[0],
        gameName: '',
        cardpackIds: [],
        timeout: 30,
        maxPlayers: 8
      })).to.be.rejectedWith('Game name cannot be blank');
    });
    it('Should reject when game name is invalid', () => {
      return expect(games.createGame({
        creator: users[0],
        gameName: null,
        cardpackIds: [],
        timeout: 30,
        maxPlayers: 8
      })).to.be.rejectedWith('Game name must be a string');
    });
    it('Should reject when game name is already taken', () => {
      return games.createGame({
        creator: users[0],
        gameName: 'game',
        cardpackIds: [],
        timeout: 30,
        maxPlayers: 8
      })
        .then(() => {
          return expect(games.createGame({
            creator: users[0],
            gameName: 'game',
            cardpackIds: [],
            timeout: 30,
            maxPlayers: 8
          })).to.be.rejectedWith('A game with this name already exists');
        });
    });
  });

  describe('getUserGame()', () => {
    it('Should return game object when user is in a game', () => {
      return games.createGame({
        creator: users[0],
        gameName: 'game',
        cardpackIds: [],
        timeout: 30,
        maxPlayers: 8
      })
        .then(() => {
          expect(games.getUserGame(users[0]).name).to.equal('game');
        });
    });
    it('Should return null when user is not in a game', () => {
      return expect(games.getUserGame(users[0])).to.equal(null);
    });
    it('Should return undefined when user is not defined', () => {
      return expect(games.getUserGame()).to.equal(undefined);
    });
  });
});