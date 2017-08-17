let Users = require('./Users.js');
let socketHandler = require('../server/socketHandler.js');

const ROUND_STAGES = {
  playBlackCard: 1,
  playWhiteCards: 2,
  judgeRound: 3,
  incrementScore: 4
};

const minPlayerCount = 3;

class Game {
  constructor (creator) {
    this.users = new Users();
    this.users.addUser(creator);
    this.running = false;
    this.roundStage;
  }

  start () {
    if (this.users.size >= minPlayerCount) {
      this.roundStage = ROUND_STAGES.playBlackCard;
      this.running = true;
    }
  }

  sendDataToUsers (dataType, data) {
    socketHandler.respondByUserEmail(this.users.getEmailsOfCurrentUsers(), dataType, data);
  }
}

module.exports = Game;