const BlackCardDeck = require('./blackCardDeck');
const Users = require('./Users.js');
// TODO - Rename Users.js to Players.js

const ROUND_STAGES = {
  playBlackCard: 1,
  playWhiteCards: 2,
  judgeRound: 3,
  incrementScore: 4
};

const ROUND_NAMES = {
  1: 'round setup',
  2: 'card play phase',
  3: 'round judging',
  4: 'round end'
};

const minPlayerCount = 3;
const roundEndDelay = 8; // Number of seconds after the round has ended before moving to the next

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class Game {
  constructor (creator, blackCards, whiteCards, timeout, maxPlayers, handSize) {
    this.handSize = handSize;
    this.blackCardDeck = new BlackCardDeck(blackCards);
    this.whiteCardDraw = whiteCards;
    this.whiteCardDiscard = [];
    this.currentWhiteCards = {};

    this.maxPlayers = maxPlayers;
    this.users = new Users();
    this.addUser(creator);
    this.timeoutId; // Saved to allow pausing and stopping of games
    this.roundStage;
    this.timeout = timeout;

    this.continue = this.continue.bind(this);
  }

  addUser (user) {
    // TODO - Add function to Users that allows for searching its userTable and remove the manual lookup of that property right below
    if (this.users.size() < this.maxPlayers && !this.users.userTable[user.email]) {
      this.users.addUser(user);
      for (let i = 0; i < this.handSize; i++) {
        this.drawForUser(user);
      }
      return true;
    }
    return false;
  }
  removeUser (user) {
    let userHand = this.users.removeUser(user);
    if (userHand) {
      // while (this.playerHands[user.email].length) {
      //   this.whiteCardDiscard.push(this.playerHands[user.email].pop());
      // }
      // delete this.playerHands[user.email];
      return true;
    } else {
      return false;
    }
  }

  drawForUser (user) {
    if (this.whiteCardDraw.length === 0) {
      this.whiteCardDraw = this.whiteCardDiscard;
      this.whiteCardDiscard = [];
    }
    let cardIndex = getRandomInt(0, this.whiteCardDraw.length - 1);
    this.users.drawCard(user, this.whiteCardDraw.splice(cardIndex, 1)[0]);
  }

  playCard (user, card) {
    if (!this.isRunning()) {
      throw new Error('Game is not running');
    }
    if (this.roundStage !== ROUND_STAGES.playWhiteCards) {
      throw new Error('Cannot play cards during ' + ROUND_NAMES[this.roundStage]);
    }
    if (this.currentWhiteCards[user.email]) {
      throw new Error('You have already played a card for this round');
    }
    if (this.users.getJudge().email === user.email) {
      throw new Error('Cannot play a card when you are the judge');
    }

    let hand = this.users.getHand(user);
    for (let i = 0; i < hand.length; i++) {
      if (card.id === hand[i].id) {
        this.currentWhiteCards[user.email] = hand.splice(i, 1);
        // If this is the last user to play a card, then stop waiting and move on to the next step of the round
        if (Object.keys(this.currentWhiteCards).length === this.users.size()) {
          this.continue();
        }
        return true;
      }
    }
    throw new Error('User does not have that card in their hand');
  }

  discardCurrentWhiteCards () {
    Object.keys(this.currentWhiteCards).forEach((key, index) => {
      let card = this.currentWhiteCards[key];
      delete this.currentWhiteCards[key];
      this.whiteCardDiscard.push(card);
    });
  }

  start () {
    if (this.users.size() < minPlayerCount) {
      throw new Error('Not enough players to start game');
    }
    if (this.roundStage) {
      // Game is paused
      this.continue();
    } else {
      this.roundStage = ROUND_STAGES.playBlackCard;
      this.timeoutId = setTimeout(this.continue, this.timeout);
    }
  }
  stop () {
    // TODO - Reset all game variables
    this.discardCurrentWhiteCards();
    this.whiteCardDraw = this.whiteCardDiscard;
    this.whiteCardDiscard = [];
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    this.discardCurrentWhiteCards();
  }
  pause () {
    if (!this.timeoutId) {
      throw new Error('Game is not running');
    }
    clearTimeout(this.timeoutId);
    this.timeoutId = undefined;
  }

  isRunning () {
    return !!this.timeoutId;
  }

  continue () {
    if (this.roundStage === ROUND_STAGES.playBlackCard) {
      this.discardCurrentWhiteCards();
      this.blackCardDeck.cycleCard();
      this.roundStage++;
      this.timeoutId = setTimeout(this.continue, 0);
    } else if (this.roundStage === ROUND_STAGES.playWhiteCards) {
      this.roundStage++;
      this.timeoutId = setTimeout(this.continue, this.timeout);
    } else if (this.roundStage === ROUND_STAGES.judgeRound) {
      this.roundStage++;
      this.timeoutId = setTimeout(this.continue, this.timeout);
    } else if (this.roundStage === ROUND_STAGES.incrementScore) {
      this.roundStage = ROUND_STAGES.playBlackCard;
      this.timeoutId = setTimeout(this.continue, roundEndDelay);
    }
  }

  sendDataToUsers (dataType, data) {
    socketHandler.respondToUsersByEmail(this.users.getCurrentUsers(), dataType, data);
  }

  getState (currentUser) {
    let otherPlayers = this.users.getAllUsers().filter((user) => {
      return user.email !== currentUser.email;
    });

    return {
      hand: [],
      currentBlackCard: this.blackCardDeck.currentCard,
      currentWhiteCardByUser: {},
      numOtherWhiteCardsPlayed: 1,
      currentJudge: {},
      currentOwner: {},
      otherPlayers
    };
  }
}

module.exports = Game;