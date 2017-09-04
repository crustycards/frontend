const expect = require('chai').use(require('chai-as-promised')).expect;
const Games = require('../../games');
const { connection, User, Cardpack, Card } = require('../../database');

let users = [];
for (let i = 0; i < 50; i++) {
  users.push({
    id: i + 1,
    email: 'user' + i + '@gmail.com',
    password: 'asdf',
    firstname: 'foo',
    lastname: 'bar'
  });
}
let whiteCards = [];
for (let i = 0; i < 25; i++) {
  whiteCards.push({
    id: i + 1,
    text: 'white card ' + i,
    type: 'white'
  });
}
let blackCards = [];
for (let i = 0; i < 25; i++) {
  blackCards.push({
    id: i + 1,
    text: 'black card ' + i,
    type: 'black'
  });
}

describe('Games', () => {
  let games;
  before(() => {
    return connection.clear()
      .then(() => {
        return User.model.create(users[0])
          .then(() => {
            return Cardpack.create(users[0].email, 'cardpack');
          })
          .then((cardpack) => {
            let promises = [];
            whiteCards.forEach((card) => {
              promises.push(
                Card.create({userId: users[0].id, cardpackId: cardpack.id, text: card.text, type: card.type})
              );
            });
            blackCards.forEach((card) => {
              promises.push(
                Card.create({userId: users[0].id, cardpackId: cardpack.id, text: card.text, type: card.type})
              );
            });
            return Promise.all(promises);
          });
      });
  });
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

  describe('getAll()', () => {
    it('Should return empty array if no games exist', () => {
      expect(games.getAll()).to.eql([]);
    });
    it('Should return array of games when games exist', () => {
      return games.createGame({
        creator: users[0],
        gameName: 'thisisagame',
        cardpackIds: [],
        timeout: 30,
        maxPlayers: 8
      })
        .then((game) => {
          let gameList = games.getAll();
          expect(gameList.length).to.equal(1);
          expect(gameList[0].name).to.equal('thisisagame');
        });
    });
  });

  describe('joinGame()', () => {
    it('Should succeed when all parameters are valid', () => {
      return games.createGame({
        creator: users[0],
        gameName: 'thisisagame',
        cardpackIds: [],
        timeout: 30,
        maxPlayers: 8
      })
        .then((game) => {
          expect(games.joinGame(users[1], 'thisisagame')).to.not.throw;
        });
    });
    it('Should error when trying to join a game when you are already in a one', () => {
      return games.createGame({
        creator: users[0],
        gameName: 'thisisagame',
        cardpackIds: [],
        timeout: 30,
        maxPlayers: 8
      })
        .then((game) => {
          expect(() => {games.joinGame(users[0], 'thisisagame')}).to.throw(Error, 'You are already in a game');
        });
    });
    it('Should error when joining a game that does not exist', () => {
      expect(() => {games.joinGame(users[0], 'notarealgame')}).to.throw(Error, 'Game does not exist');
    });
    it('Should error when user joining as an invalid user', () => {
      return games.createGame({
        creator: users[0],
        gameName: 'thisisagame',
        cardpackIds: [],
        timeout: 30,
        maxPlayers: 8
      })
        .then((game) => {
          expect(() => {games.joinGame({}, 'thisisagame')}).to.throw(Error, 'User is invalid');
        });
    });
  });

  describe('leaveGame()', () => {
    beforeEach(() => {
      return games.createGame({
        creator: users[0],
        gameName: 'thisisagame',
        cardpackIds: [],
        timeout: 30,
        maxPlayers: 8
      });
    });
    it('Should succeed when all parameters are valid', () => {
      // TODO - Possibly put function inside anonymous function wrapper
      expect(games.leaveGame(users[0])).to.not.throw;
    });
    it('Should throw error when leaving a game as a user that is not in a game', () => {
      expect(() => {games.leaveGame(users[1])}).to.throw(Error, 'User is not in a game');
    });
    it('Should throw error when attempting to leave a game as an invalid user', () => {
      expect(() => {games.leaveGame({})}).to.throw(Error, 'User is invalid');
    });
    it('Should delete game if the last user leaves', () => {
      expect(games.gamesByName['thisisagame']).to.exist;
      games.leaveGame(users[0]);
      expect(games.gamesByName['thisisagame']).to.not.exist;
    });
  });

  describe('getStateFor()', () => {
    beforeEach(() => {
      return games.createGame({
        creator: users[0],
        gameName: 'thisisagame',
        cardpackIds: [1],
        timeout: 30,
        maxPlayers: 8,
        handSize: 4
      });
    });
    it('Should not throw error when all parameters are valid', () => {
      expect(games.getStateFor(users[0])).to.not.throw;
    });
    it('Should return correct game name', () => {
      expect(games.getStateFor(users[0]).gameName).to.equal('thisisagame');
    });
    it('Should return the user\'s hand', () => {
      let hand = games.getStateFor(users[0]).hand;
      expect(hand).to.be.a('array');
      expect(hand.length).to.equal(4);
      hand.forEach((card) => {
        expect(card).to.exist;
        expect(card.id).to.exist;
        expect(card.text).to.exist;
        expect(card.type).to.exist;
      });
    });
    it('Should throw error if user is invalid', () => {
      expect(() => {games.getStateFor({})}).to.throw(Error, 'User is invalid');
    });
    it('Should throw error if not in a game', () => {
      expect(() => {games.getStateFor(users[1])}).to.throw(Error, 'You are not in a game');
    });
  });
});