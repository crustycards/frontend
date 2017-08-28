let Users = require('./Users.js');
// TODO - Rename Users.js to Players.js

const ROUND_STAGES = {
  playBlackCard: 1,
  playWhiteCards: 2,
  judgeRound: 3,
  incrementScore: 4
};

const minPlayerCount = 3;
const roundEndDelay = 8; // Number of seconds after the round has ended before moving to the next

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class Game {
  constructor (creator, blackCards, whiteCards, timeout, maxPlayers, handSize) {
    this.handSize = handSize;
    this.blackCardDraw = blackCards;
    this.whiteCardDraw = whiteCards;
    this.blackCardDiscard = [];
    this.whiteCardDiscard = [];
    this.currentBlackCard;
    this.currentWhiteCards = {};
    this.setRandomBlackCard();

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

  setRandomBlackCard () {
    // 'Shuffle' discard pile if draw pile is empty
    if (this.blackCardDraw.length === 0) {
      this.blackCardDraw = this.blackCardDiscard;
      this.blackCardDiscard = [];
    }
    // Useful when creating a new game and no current black card is set
    if (this.currentBlackCard) {
      this.blackCardDiscard.push(this.currentBlackCard);
    }
    let cardIndex = getRandomInt(0, this.blackCardDraw.length - 1);
    this.currentBlackCard = this.blackCardDraw.splice(cardIndex, 1)[0];
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
    // If it is a valid time to play a card
    if (this.isRunning && this.roundStage === ROUND_STAGES.playWhiteCards) {
      // If the user has not already played a card this round and is not the judge
      if (!this.currentWhiteCards[user.email] && this.users.getJudge().email !== user.email) {
        for (let i = 0; i < this.playerHands[user.email]; i++) {
          if (card.id === this.playerHands[user.email][i].id) {
            this.playerHands[user.email].splice(i, 1);
          }
        }
        // If this is the last user to play a card, then stop waiting and move on to the next step of the round
        if (Object.keys(this.currentWhiteCards).length === this.users.size()) {
          this.continue();
        }
      }
    }
  }

  discardCurrentWhiteCards () {
    Object.keys(this.currentWhiteCards).forEach((key, index) => {
      let card = this.currentWhiteCards[key];
      delete this.currentWhiteCards[key];
      this.whiteCardDiscard.push(card);
    });
  }

  start () {
    if (this.roundStage) {
      // Game is paused
      this.continue();
    } else if (this.users.size() >= minPlayerCount) {
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
      currentBlackCard: this.currentBlackCard,
      currentWhiteCardByUser: {},
      numOtherWhiteCardsPlayed: 1,
      currentJudge: {},
      currentOwner: {},
      otherPlayers
    };
  }
}

module.exports = Game;