const expect = require('chai').use(require('chai-as-promised')).expect;
const Game = require('../games/Game.js');
const Users = require('../games/Users.js');

let userOne = {
  id: 1,
  email: 'userOne@gmail.com'
};
let userTwo = {
  id: 1,
  email: 'userTwo@gmail.com'
};
let userThree = {
  id: 1,
  email: 'userThree@gmail.com'
};
let userFour = {
  id: 1,
  email: 'userFour@gmail.com'
};

let cards = [
  {
    id: 1,
    name: 'cardZero'
  },
  {
    id: 2,
    name: 'cardOne'
  },
  {
    id: 3,
    name: 'cardTwo'
  },
  {
    id: 4,
    name: 'cardThree'
  }
];
let blackCards = [
  {
    id: 1,
    name: 'blackCardZero'
  },
  {
    id: 2,
    name: 'blackCardOne'
  },
  {
    id: 3,
    name: 'blackCardTwo'
  },
  {
    id: 4,
    name: 'blackCardThree'
  }
];

module.exports.run = () => {
  describe('Users', () => {
    let users;
    beforeEach(() => {
      users = new Users();
    });

    it('Should contain all functions', () => {
      expect(users.size).to.be.a('function');
      expect(users.addUser).to.be.a('function');
      expect(users.removeUser).to.be.a('function');
      expect(users.getJudge).to.be.a('function');
      expect(users.getOwner).to.be.a('function');
      expect(users.getAllUsers).to.be.a('function');
      expect(users.playCard).to.be.a('function');
      expect(users.drawCard).to.be.a('function');
      expect(users.getHand).to.be.a('function');
      expect(users.getScore).to.be.a('function');
      expect(users.incrementScore).to.be.a('function');
      expect(users.cycleJudge).to.be.a('function');
      expect(users.sendDataToAllPlayers).to.be.a('function');
      expect(users.sendDataToPlayer).to.be.a('function');
    });

    it('Should keep track of number of users through size() method', () => {
      expect(users.size()).to.equal(0);
      users.addUser(userOne);
      expect(users.size()).to.equal(1);
      users.addUser(userTwo);
      expect(users.size()).to.equal(2);
      users.addUser(userThree);
      expect(users.size()).to.equal(3);
      users.addUser(userFour);
      expect(users.size()).to.equal(4);
    });
    it('Should not increment number of users when adding a user that is already in the game', () => {
      expect(users.size()).to.equal(0);
      users.addUser(userOne);
      expect(users.size()).to.equal(1);
      users.addUser(userOne);
      users.addUser(userTwo);
      expect(users.size()).to.equal(2);
      users.addUser(userTwo);
      users.addUser(userThree);
      expect(users.size()).to.equal(3);
      users.addUser(userThree);
      users.addUser(userFour);
      expect(users.size()).to.equal(4);
    });
    it('Should return true when adding a user that is not in the game and false when adding a user that is already in the game', () => {
      expect(users.addUser(userOne)).to.equal(true);
      expect(users.addUser(userOne)).to.equal(false);
      expect(users.addUser(userTwo)).to.equal(true);
      expect(users.addUser(userTwo)).to.equal(false);
      expect(users.addUser(userThree)).to.equal(true);
      expect(users.addUser(userThree)).to.equal(false);
      expect(users.addUser(userFour)).to.equal(true);
      expect(users.addUser(userFour)).to.equal(false);
    });
    it('Should keep track of size when removing users', () => {
      users.addUser(userOne);
      users.removeUser(userTwo);
      expect(users.size()).to.equal(1);
      users.removeUser(userOne);
      expect(users.size()).to.equal(0);
      expect(users.userTable[userOne.email]).to.not.exist;
    });
    it('Should keep track of users in hash table', () => {
      users.addUser(userOne);
      expect(users.userTable[userOne.email]).to.exist;
      users.removeUser(userOne);
      expect(users.userTable[userOne.email]).to.not.exist;
    });
    it('Should set judge and owner when adding first user', () => {
      users.addUser(userOne);
      expect(users.getOwner().email).to.equal(userOne.email);
      expect(users.getJudge().email).to.equal(userOne.email);
      users.addUser(userTwo);
      expect(users.getOwner().email).to.equal(userOne.email);
      expect(users.getJudge().email).to.equal(userOne.email);
    });
    it('Should set judge and owner to null when removing only user', () => {
      users.addUser(userOne);
      expect(users.getOwner().email).to.equal(userOne.email);
      expect(users.getJudge().email).to.equal(userOne.email);
      users.removeUser(userOne);
      expect(users.getOwner()).to.not.exist;
      expect(users.getJudge()).to.not.exist;
    });
    it('Should cycle judges correctly', () => {
      users.addUser(userOne);
      users.addUser(userTwo);
      users.addUser(userThree);
      users.addUser(userFour);
      expect(users.getJudge().email).to.equal(userOne.email);
      users.cycleJudge();
      expect(users.getJudge().email).to.equal(userTwo.email);
      users.cycleJudge();
      expect(users.getJudge().email).to.equal(userThree.email);
      users.cycleJudge();
      expect(users.getJudge().email).to.equal(userFour.email);
      users.cycleJudge();
      expect(users.getJudge().email).to.equal(userOne.email);
    });
    it('Should return all users when calling getAllUsers()', () => {
      expect(users.getAllUsers()).to.eql([]);
      users.addUser(userOne);
      expect(users.getAllUsers()).to.eql([userOne]);
      users.addUser(userTwo);
      expect(users.getAllUsers()).to.eql([userOne, userTwo]);
      users.addUser(userThree);
      expect(users.getAllUsers()).to.eql([userOne, userTwo, userThree]);
      users.addUser(userFour);
      expect(users.getAllUsers()).to.eql([userOne, userTwo, userThree, userFour]);
      users.addUser(userOne);
      expect(users.getAllUsers()).to.eql([userOne, userTwo, userThree, userFour]);
    });
    it('Should reassign owner if current owner leaves', () => {
      users.addUser(userOne);
      users.addUser(userTwo);
      users.removeUser(userOne);
      expect(users.getOwner().email).to.equal(userTwo.email);
    });
    it('Should reassign judge if current judge leaves', () => {
      users.addUser(userOne);
      users.addUser(userTwo);
      users.removeUser(userOne);
      expect(users.getJudge().email).to.equal(userTwo.email);
    });

    it(`Should save a player's hand if passed in when adding a user`, () => {
      users.addUser(userOne, cards);
      expect(users.getHand(userOne)).to.equal(cards);
    });
    it(`Should be able to play a card that exists in a player's hand and return it`, () => {
      let hand = JSON.parse(JSON.stringify(cards));
      users.addUser(userOne, hand);
      expect(users.playCard(userOne, cards[0])).to.eql(cards[0]);
      expect(users.getHand(userOne).length).to.equal(3);
    });
    it(`Should return undefined when attempting to play a card from a user's hand that does not exist`, () => {
      let hand = JSON.parse(JSON.stringify(cards));
      let fakeCard = {id: 4321, name: 'fakecard'};
      users.addUser(userOne, hand);
      expect(users.playCard(userOne, fakeCard)).to.not.exist;
      expect(users.getHand(userOne).length).to.equal(4);
    });
    it(`Should be able to draw a card for a user`, () => {
      let hand = JSON.parse(JSON.stringify(cards));
      let newCard = {id: 1234, name: 'thisisatestcard'};
      users.addUser(userOne, hand);
      users.drawCard(userOne, newCard);
      let userHand = users.getHand(userOne);
      expect(userHand[userHand.length - 1]).to.eql(newCard);
    });
    it(`Should return a user's hand when removing that user`, () => {
      users.addUser(userOne, cards);
      expect(users.removeUser(userOne)).to.equal(cards);
    });

    it(`Should manage user's score`, () => {
      users.addUser(userOne);
      expect(users.getScore(userOne)).to.equal(0);
      users.incrementScore(userOne);
      expect(users.getScore(userOne)).to.equal(1);
      users.incrementScore(userOne);
      expect(users.getScore(userOne)).to.equal(2);
    });
  });

  describe('Game', () => {
    let game;
    beforeEach(() => {
      game = new Game(userOne, blackCards, cards, 100, 3);
    });

    it('Should contain all functions', () => {
      expect(game.getState).to.be.a('function');
      expect(game.addUser).to.be.a('function');
      expect(game.removeUser).to.be.a('function');
      expect(game.start).to.be.a('function');
      expect(game.stop).to.be.a('function');
      expect(game.pause).to.be.a('function');
      expect(game.isRunning).to.be.a('function');
      expect(game.playCard).to.be.a('function');
      expect(game.forceContinue).to.be.a('function');
      expect(game.setRandomBlackCard).to.be.a('function');
      expect(game.drawForUser).to.be.a('function');
      expect(game.discardCurrentWhiteCards).to.be.a('function');
      expect(game.continue).to.be.a('function');
      expect(game.sendDataToUsers).to.be.a('function');
    });

    describe('getState()', () => {
      it('Should return all keys when getting state of basic game', () => {
        let state = game.getState(userOne);
        expect(state.hand).to.be.a('array');
        expect(state.currentBlackCard).to.be.a('object');
        expect(state.currentWhiteCardByUser).to.be.a('object');
        expect(state.numOtherWhiteCardsPlayed).to.be.a('number');
        expect(state.currentJudge).to.be.a('object');
        expect(state.currentOwner).to.be.a('object');
        expect(state.otherPlayers).to.be.a('array');
        expect(Object.keys(state).length).to.equal(7);
      });
    });

    describe('addUser()', () => {
      it('Should add users to games', () => {
        game.addUser(userTwo);
        expect(game.getState(userOne).otherPlayers).to.eql([userTwo]);
        expect(game.getState(userTwo).otherPlayers).to.eql([userOne]);
        game.addUser(userThree);
        expect(game.getState(userOne).otherPlayers).to.eql([userTwo, userThree]);
        expect(game.getState(userTwo).otherPlayers).to.eql([userOne, userThree]);
        expect(game.getState(userThree).otherPlayers).to.eql([userOne, userTwo]);
      });
      it('Should not add a user if the game is full', () => {
        expect(game.addUser(userTwo)).to.equal(true);
        expect(game.addUser(userThree)).to.equal(true);
        expect(game.addUser(userFour)).to.equal(false);
        expect(game.getState(userOne).otherPlayers).to.eql([userTwo, userThree]);
        expect(game.getState(userTwo).otherPlayers).to.eql([userOne, userThree]);
        expect(game.getState(userThree).otherPlayers).to.eql([userOne, userTwo]);
        expect(game.getState(userFour).otherPlayers).to.throw;
      });
    });

    describe('removeUser()', () => {
      it('Should remove existing users from games and return true to indicate that the removal was successful', () => {
        game.addUser(userTwo);
        game.addUser(userThree);
        expect(game.removeUser(userOne)).to.equal(true);
        expect(game.removeUser(userTwo)).to.equal(true);
        expect(game.removeUser(userThree)).to.equal(true);
        // Not adding user four because game limit is three
      });
      it('Should return false when removing a user that is not in the game', () => {
        expect(game.removeUser(userTwo)).to.equal(false);
      });
    });
  });
};