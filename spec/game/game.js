const expect = require('chai').use(require('chai-as-promised')).expect;
const Game = require('../../games/Game.js');

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

let cards = [];
for (let i = 0; i < 50; i++) {
  cards.push({
    id: i + 1,
    name: 'card ' + i
  });
}
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

describe('Game', () => {
  let game;
  let handSize = 5;
  beforeEach(() => {
    let blackCardsNonref = JSON.parse(JSON.stringify(blackCards));
    let whiteCardsNonref = JSON.parse(JSON.stringify(cards));
    game = new Game(userOne, blackCardsNonref, whiteCardsNonref, 100, 3, handSize);
  });

  it('Should contain all functions', () => {
    expect(game.addUser).to.be.a('function');
    expect(game.removeUser).to.be.a('function');
    expect(game.drawForUser).to.be.a('function');
    expect(game.playCard).to.be.a('function');
    expect(game.start).to.be.a('function');
    expect(game.stop).to.be.a('function');
    expect(game.pause).to.be.a('function');
    expect(game.isRunning).to.be.a('function');
    expect(game.continue).to.be.a('function');
    expect(game.sendDataToUsers).to.be.a('function');
    expect(game.getState).to.be.a('function');
  });

  describe('addUser()', () => {
    it('Should add users to games', () => {
      game.addUser(userTwo);
      expect(game.players.size()).to.equal(2);
      game.addUser(userThree);
      expect(game.players.size()).to.equal(3);
    });
    it('Should not add a user if the game is full', () => {
      expect(game.addUser(userTwo)).to.equal(true);
      expect(game.addUser(userThree)).to.equal(true);
      expect(() => {game.addUser(userFour)}).to.throw(Error, 'Game is full');
    });
    it('Should not add a user if they are already in the game', () => {
      expect(game.addUser(userTwo)).to.equal(true);
      expect(() => {game.addUser(userTwo)}).to.throw(Error, 'You are already in this game');
      expect(game.players.size()).to.eql(2);
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
      game.addUser(userTwo);
      expect(game.removeUser(userTwo)).to.equal(true);
      expect(game.removeUser(userTwo)).to.equal(false);
    });
  });

  describe('drawForUser()', () => {
    it('Should be called upon game creation for the game creator', () => {
      expect(game.whiteCardDeck.drawPile.length).to.equal(cards.length - handSize);
    });
    it('Should be called when adding users', () => {
      game.addUser(userTwo);
      expect(game.whiteCardDeck.drawPile.length).to.equal(cards.length - (handSize * 2));
    });
    it('Should not called when adding duplicate users', () => {
      game.addUser(userTwo);
      expect(() => {game.addUser(userTwo)}).to.throw(Error, 'You are already in this game');
      expect(game.whiteCardDeck.drawPile.length).to.equal(cards.length - (handSize * 2));
    });
  });

  describe('playCard()', () => {
    it('Should allow playing cards if the game is running', () => {
      game.addUser(userTwo);
      game.addUser(userThree);
      game.start();
      game.continue();
      let card = game.players.userTable[userTwo.email].hand[0];
      expect(game.playCard(userTwo, card)).to.equal(true);
    });
    it('Should throw error when attempting to play a card while the game is not running', () => {
      game.addUser(userTwo);
      let card = game.players.userTable[userOne.email].hand[0];
      expect(() => {game.playCard(userOne, card)}).to.throw(Error, 'Game is not running');
    });
    it('Should throw error when attempting to play a card during the wrong round phase', () => {
      game.addUser(userTwo);
      game.addUser(userThree);
      game.start();
      let card = game.players.userTable[userOne.email].hand[0];
      expect(() => {game.playCard(userOne, card)}).to.throw(Error, 'Cannot play cards during');
    });
    it('Should throw error when attempting to play a card after already playing one', () => {
      game.addUser(userTwo);
      game.addUser(userThree);
      game.start();
      game.continue();
      let card = game.players.userTable[userTwo.email].hand[0];
      game.playCard(userTwo, card);
      expect(() => {game.playCard(userTwo, card)}).to.throw(Error, 'You have already played a card for this round');
    });
    it('Should throw error when judge attempts to play a card', () => {
      game.addUser(userTwo);
      game.addUser(userThree);
      game.start();
      game.continue();
      let card = game.players.userTable[userOne.email].hand[0];
      expect(() => {game.playCard(userOne, card)}).to.throw(Error, 'Cannot play a card when you are the judge');
    });
  });

  describe('discardCurrentWhiteCards()', () => {
    it('Should place all current cards in the white card discard pile', () => {
      game.addUser(userTwo);
      game.addUser(userThree);
      game.start();
      game.continue();
      let card = game.players.userTable[userTwo.email].hand[0];
      expect(Object.keys(game.whiteCardDeck.currentCards).length).to.equal(0);
      game.playCard(userTwo, card);
      expect(Object.keys(game.whiteCardDeck.currentCards).length).to.equal(1);
      game.whiteCardDeck.resetCurrentCards();
      expect(Object.keys(game.whiteCardDeck.currentCards).length).to.equal(0);
      expect(game.whiteCardDeck.discardPile.length).to.equal(1);
    });
  });

  describe('start()', () => {
    it('Should start game when appropriate', () => {
      game.addUser(userTwo);
      game.addUser(userThree);
      game.start();
      expect(game.isRunning()).to.equal(true);
    });
    it('Should throw error when not enough users are in the game', () => {
      expect(() => {game.start()}).to.throw(Error, 'Not enough players to start game');
      expect(game.isRunning()).to.equal(false);
    });
  });

  describe('stop()', () => {
    it('');
  });

  describe('pause()', () => {
    it('');
  });

  describe('isRunning()', () => {
    it('');
  });

  describe('continue()', () => {
    it('');
  });

  describe('sendDataToUsers()', () => {
    it('');
  });

  describe('getState()', () => {
    it('Should return all keys when getting state of basic game', () => {
      let state = game.getState(userOne);
      expect(state.hand).to.be.a('array');
      expect(state.currentBlackCard).to.be.a('object');
      expect(state.playerCurrentWhiteCard).to.equal(null);
      expect(state.numOtherWhiteCardsPlayed).to.be.a('number');
      expect(state.currentJudge).to.be.a('object');
      expect(state.currentOwner).to.be.a('object');
      expect(state.otherPlayers).to.be.a('array');
      expect(state.roundStage).to.be.a('string');
      expect(Object.keys(state).length).to.equal(8);
    });
    it('Should throw when getting state for a user that is not in the game', () => {
      expect(game.getState(userFour).otherPlayers).to.throw;
    });
    describe('hand', () => {
      it(`Should contain the user's hand`, () => {
        let hand = game.getState(userOne).hand;
        expect(hand).to.be.a('array');
        expect(hand.length).to.equal(handSize);
        hand.forEach((card) => {
          expect(card.id).to.exist;
        });
      });
    });
    describe('currentBlackCard', () => {
      it('Should be set upon game creation', () => {
        expect(game.getState(userOne).currentBlackCard).to.exist;
        expect(game.getState(userOne).currentBlackCard.id).to.exist;
      });
    });
    describe('playerCurrentWhiteCard', () => {
      it('Should be null before any card is played', () => {
        expect(game.getState(userOne).playerCurrentWhiteCard).to.equal(null);
      });
      it('Should return a card object once the user has played a card', () => {
        //
      });
    });
    describe('numOtherWhiteCardsPlayed', () => {
      it('Should keep track of number of other cards played', () => {
        game.addUser(userTwo);
        game.addUser(userThree);
        game.start();
        game.continue();
        expect(game.getState(userOne).numOtherWhiteCardsPlayed).to.equal(0);
        let card = game.players.userTable[userTwo.email].hand[0];
        game.playCard(userTwo, card);
        expect(game.getState(userOne).numOtherWhiteCardsPlayed).to.equal(1);
      });
      it('Should not keep track of whether the current player has played a card', () => {
        game.addUser(userTwo);
        game.addUser(userThree);
        game.start();
        game.continue();
        let card = game.players.userTable[userTwo.email].hand[0];
        game.playCard(userTwo, card);
        expect(game.getState(userTwo).numOtherWhiteCardsPlayed).to.equal(0);
      });
    });
    describe('currentJudge', () => {
      it('Should be set upon game creation', () => {
        expect(game.getState(userOne).currentJudge).to.exist;
        expect(game.getState(userOne).currentJudge).to.equal(userOne);
      });
    });
    describe('currentOwner', () => {
      it('Should be set upon game creation', () => {
        expect(game.getState(userOne).currentOwner).to.exist;
        expect(game.getState(userOne).currentOwner).to.equal(userOne);
      });
    });
    describe('otherPlayers', () => {
      it('Should return correct values for different players', () => {
        game.addUser(userTwo);
        expect(game.getState(userOne).otherPlayers).to.eql([userTwo]);
        expect(game.getState(userTwo).otherPlayers).to.eql([userOne]);
        game.addUser(userThree);
        expect(game.getState(userOne).otherPlayers).to.eql([userTwo, userThree]);
        expect(game.getState(userTwo).otherPlayers).to.eql([userOne, userThree]);
        expect(game.getState(userThree).otherPlayers).to.eql([userOne, userTwo]);
      });
    });
    describe('roundStage', () => {
      it('');
    });
  });
});