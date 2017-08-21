let socketHandler = require('../server/socketHandler.js');

class Users {
  constructor () {
    this.head = null;
    this.tail = null;
    this.judge = null;
    this.owner = null;
    this.userTable = {}; // Maps user emails to their respective linked-list nodes
    this.numPlayers = 0;
  }

  size () {
    return this.numPlayers;
  }

  addUser (user, cards) {
    // If the user is already registered in this Users object, don't do anything
    if (!this.userTable[user.email]) {
      this.numPlayers++;
      let userNode = new Node(user, cards);
      this.userTable[user.email] = userNode;
      // If there are no users in the game
      if (this.head === null) {
        this.head = this.tail = this.owner = this.judge = userNode;
      } else {
        this.tail.next = userNode;
        userNode.prev = this.tail;
        this.tail = userNode;
      }
    }
  }
  removeUser (user) {
    let userNode = this.userTable[user.email];
    // If the user doesn't exist in this Users object, don't do anything
    if (userNode) {
      if (this.head === this.tail) {
        this.head = this.tail = this.judge = this.owner = null;
      } else {
        if (userNode.prev) {
          userNode.prev.next = userNode.next;
        }
        if (userNode.next) {
          userNode.next.prev = userNode.prev;
        }
        if (this.owner === userNode) {
          this.owner = userNode.next || this.head;
        }
        if (this.judge === userNode) {
          this.judge = userNode.next || this.head;
        }
      }
      this.numPlayers--;
      delete this.userTable[user.email];
      return userNode.hand;
    }
  }

  getJudge () {
    if (this.size() > 0) {
      return this.judge.user;
    } else {
      return undefined
    }
  }
  getOwner () {
    if (this.size() > 0) {
      return this.owner.user;
    } else {
      return undefined
    }
  }

  // Returns the card if the user has it in their hand, or undefined if it is not
  playCard (user, cardToPlay) {
    let playerHand = this.userTable[user.email].hand;
    let returnCard = undefined;
    playerHand.forEach((card, index) => {
      if (card.id === cardToPlay.id) {
        returnCard = playerHand.splice(index, 1)[0];
      }
    });
    return returnCard;
  }

  drawCard (user, card) {
    this.userTable[user.email].hand.push(card);
  }

  getHand (user) {
    return this.userTable[user.email].hand;
  }

  getScore (user) {
    return this.userTable[user.email].score;
  }
  incrementScore (user) {
    this.userTable[user.email].score++;
  }

  cycleJudge () {
    this.judge = this.judge.next || this.head;
  }
  sendDataToAllPlayers (dataType, data) {
    let currentNode = this.head;
    let userEmails = [];
    while(currentNode) {
      userEmails.push(currentNode.user.email);
      currentNode = currentNode.next;
    }
    socketHandler.respondToUsersByEmail(userEmails, dataType, data);
  }
  sendDataToPlayer (email, dataType, data) {
    if (userTable[email]) {
      socketHandler.respondToUsersByEmail([email], dataType, data);
    }
  }
}

class Node {
  constructor (user, cards, prev = null, next = null) {
    this.user = user;
    this.hand = cards;
    this.score = 0;
    this.prev = prev;
    this.next = next;
  }
}

module.exports = Users;