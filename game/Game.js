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

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class Game {
  constructor (creator, blackCards, whiteCards, timeout = 30) {
    this.users = new Users();
    this.users.addUser(creator);
    this.timeoutId;
    this.roundStage;
    this.timeout = timeout;
    this.blackCardPool = blackCards;
    this.whiteCardPool = whiteCards;
    this.blackCardDiscard = [];
    this.whiteCardDiscard = [];
    this.blackCardCurrent;
    this.whiteCardsCurrent;
    this.continue = this.continue.bind(this);
  }

  start () {
    if (this.users.size >= minPlayerCount) {
      this.roundStage = ROUND_STAGES.playBlackCard;
      this.timeoutId = setTimeout(this.continue, this.timeout);
    }
  }
  stop () {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
  isRunning () {
    return !!this.timeoutId;
  }

  drawRandomBlackCard () {
    let cardIndex = getRandomInt(0, this.blackCardPool.length);
    this.blackCardCurrent = this.blackCardPool[cardIndex];
    this.blackCardPool.splice(cardIndex, 1);
    this.blackCardDiscard.push(blackCardCurrent);
  }
  // drawRandomWhiteCard () {
  //   let cardIndex = getRandomInt(0, this.whiteCardPool.length);
  //   this.whiteCardCurrent = this.whiteCardPool[cardIndex];
  //   this.whiteCardPool.splice(cardIndex, 1);
  //   this.whiteCardDiscard.push(whiteCardCurrent);
  // }

  continue () {
    if (this.roundStage === ROUND_STAGES.playBlackCard) {
      this.blackCard = drawRandomBlackCard;
      this.roundStage++;
      this.timeoutId = setTimeout(this.continue(), 0);
    } else if (this.roundStage = ROUND_STAGES.)
  }

  sendDataToUsers (dataType, data) {
    socketHandler.respondByUserEmail(this.users.getEmailsOfCurrentUsers(), dataType, data);
  }
}

module.exports = Game;