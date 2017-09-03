const BlackCardDeck = require('./blackCardDeck');
const WhiteCardDeck = require('./whiteCardDeck');
const Players = require('./Players.js');

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
    this.whiteCardDeck = new WhiteCardDeck(whiteCards);
    this.players = new Players(maxPlayers);
    this.addUser(creator);
    this.timeoutId; // Saved to allow pausing and stopping of games
    this.roundStage;
    this.timeout = timeout;

    this.continue = this.continue.bind(this);
  }

  addUser (user) {
    // TODO - Add function to Users that allows for searching its userTable and remove the manual lookup of that property right below
    this.players.addUser(user);
    for (let i = 0; i < this.handSize; i++) {
      this.drawForUser(user);
    }
    return true;
  }
  removeUser (user) {
    let userHand = this.players.removeUser(user);
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
    this.players.drawCard(user, this.whiteCardDeck.popCard());
  }

  playCard (user, card) {
    if (!this.isRunning()) {
      throw new Error('Game is not running');
    }
    if (this.roundStage !== ROUND_STAGES.playWhiteCards) {
      throw new Error('Cannot play cards during ' + ROUND_NAMES[this.roundStage]);
    }
    if (this.whiteCardDeck.currentCards[user.email]) {
      throw new Error('You have already played a card for this round');
    }
    if (this.players.getJudge().email === user.email) {
      throw new Error('Cannot play a card when you are the judge');
    }

    let hand = this.players.getHand(user);
    for (let i = 0; i < hand.length; i++) {
      if (card.id === hand[i].id) {
        this.whiteCardDeck.playCard(user, hand.splice(i, 1));
        // If this is the last user to play a card, then stop waiting and move on to the next step of the round
        if (Object.keys(this.whiteCardDeck.currentCards).length === this.players.size()) {
          this.continue();
        }
        return true;
      }
    }
    throw new Error('User does not have that card in their hand');
  }

  start () {
    if (this.players.size() < minPlayerCount) {
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
    this.whiteCardDeck.resetCurrentCards();
    // TODO - Add whiteCardDeck resetAll() method and use it here
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    this.whiteCardDeck.resetCurrentCards();
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
      this.whiteCardDeck.resetCurrentCards();
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
    socketHandler.respondToUsersByEmail(this.players.getCurrentUsers(), dataType, data);
  }

  getState (currentUser) {
    let playerCurrentWhiteCard = this.whiteCardDeck.currentCards[currentUser.email] || null;
    let numOtherWhiteCardsPlayed = Object.keys(this.whiteCardDeck.currentCards).length;
    if (playerCurrentWhiteCard) {
      numOtherWhiteCardsPlayed--;
    }

    let otherPlayers = this.players.getAllUsers().filter((user) => {
      return user.email !== currentUser.email;
    });

    return {
      hand: this.players.getHand(currentUser),
      currentBlackCard: this.blackCardDeck.currentCard,
      playerCurrentWhiteCard,
      numOtherWhiteCardsPlayed,
      currentJudge: this.players.getJudge(),
      currentOwner: this.players.getOwner(),
      otherPlayers,
      roundStage: ROUND_NAMES[this.roundStage] || 'Not running'
    };
  }
}

module.exports = Game;