let Users = require('./Users.js');
let socketHandler = require('../server/socketHandler.js');

const ROUND_STAGES = {
  playBlackCard: 1,
  playWhiteCards: 2,
  judgeRound: 3,
  incrementScore: 4
};

const minPlayerCount = 3;
const roundEndDelay = 8; // Number of seconds after the round has ended before moving to the next
const handSize = 5;

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class Game {
  constructor (creator, blackCards, whiteCards, timeout, maxPlayers) {
    this.users = new Users();
    this.addUser(creator);
    this.timeoutId;
    this.roundStage;
    this.maxPlayers = maxPlayers;
    this.timeout = timeout;
    this.blackCardPool = blackCards;
    this.whiteCardPool = whiteCards;
    this.blackCardDiscard = [];
    this.whiteCardDiscard = [];
    this.blackCardCurrent;
    this.whiteCardsCurrent = {}; // 
    this.playerHands = {}; // Maps user emails to an array of cards in their hand
    this.playerScores = {};
    this.continue = this.continue.bind(this);
  }

  addUser (user) {
    if (this.users.size <= this.maxPlayers) {
      this.users.addUser(user);
      this.playerHands[user.email] = [];
      for (let i = 0; i < handSize; i++) {
        drawForUser(user);
      }
    }
  }
  removeUser (user) {
    this.users.removeUser(user);
    while (this.playerHands[user.email].length) {
      this.whiteCardDiscard.push(this.playerHands[user.email].pop());
    }
    delete this.playerHands[user.email];
  }

  start () {
    if (this.roundStage) {
      // Game is paused
      this.continue();
    } else if (this.users.size >= minPlayerCount) {
      this.roundStage = ROUND_STAGES.playBlackCard;
      this.timeoutId = setTimeout(this.continue, this.timeout);
    }
  }
  stop () {
    // TODO - Reset all game variables
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    this.discardCurrentWhiteCards();
  }
  pause () {
    clearTimeout(this.timeoutId);
    this.timeoutId = undefined;
  }

  isRunning () {
    return !!this.timeoutId;
  }

  playCard (user, card) {
    // If it is a valid time to play a card
    if (this.isRunning && this.roundStage === ROUND_STAGES.playWhiteCards) {
      // If the user has not already played a card this round and is not the judge
      if (!this.whiteCardsCurrent[user.email] && this.users.judge.email !== user.email) {
        for (let i = 0; i < this.playerHands[user.email]; i++) {
          if (card.id === this.playerHands[user.email][i].id) {
            this.playerHands[user.email].splice(i, 1);
          }
        }
        // If this is the last user to play a card, then stop waiting and move on to the next step of the round
        if (Object.keys(this.whiteCardsCurrent).length === this.users.size) {
          this.forceContinue();
        }
      }
    }
  }



  forceContinue () {
    clearTimeout(this.timeoutId);
    this.continue();
  }
  setRandomBlackCard () {
    // 'Shuffle' discard pile if draw pile is empty
    if (this.blackCardPool.length === 0) {
      this.blackCardPool = this.blackCardDiscard;
      this.blackCardDiscard = [];
    }
    let cardIndex = getRandomInt(0, this.blackCardPool.length);
    this.blackCardDiscard.push(blackCardCurrent);
    this.blackCardCurrent = this.blackCardPool.splice(cardIndex, 1)[0];
  }
  drawForUser (user) {
    if (this.users.containsUser(user)) {
      let cardIndex = getRandomInt(0, this.whiteCardPool.length);
      this.playerHands[user.email].push(this.whiteCardPool.splice(cardIndex, 1)[0]);
    }
  }
  discardCurrentWhiteCards () {
    Object.keys(this.whiteCardsCurrent).forEach((key, index) => {
      let card = this.whiteCardsCurrent[key];
      delete this.whiteCardsCurrent[key];
      this.whiteCardDiscard.push(card);
    });
  }

  continue () {
    if (this.roundStage === ROUND_STAGES.playBlackCard) {
      this.discardCurrentWhiteCards();
      this.setRandomBlackCard();
      this.roundStage++;
      this.timeoutId = setTimeout(this.continue, 0);
    } else if (this.roundStage === ROUND_STAGES.playWhiteCards) {
      this.roundStage++;
      this.timeoutId = setTimeout(this.continue, this.timeout);
    } else if (this.roundStage === ROUND_STAGES.judgeRound) {
      this.roundStage++;
      this.timeoutId = setTimeout(this.continue, this.timeout);
    } else if (this.roundStage === ROUND_STAGES.incrementScore) {
      // TODO - Implement scores
      this.roundStage = ROUND_STAGES.playBlackCard;
      this.timeoutId = setTimeout(this.continue, roundEndDelay);
    }
  }

  sendDataToUsers (dataType, data) {
    socketHandler.respondByUserEmail(this.users.getEmailsOfCurrentUsers(), dataType, data);
  }
}

module.exports = Game;