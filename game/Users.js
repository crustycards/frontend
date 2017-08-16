class Users {
  constructor () {
    this.head = null;
    this.tail = null;
    this.judge = null;
    this.owner = null;
    this.userTable = {};
    this.size = 0;
  }

  addUser (user) {
    // If the user is already registered in this Users object, don't do anything
    if (!this.userTable[user.email]) {
      let userNode = new Node(user.email);
      this.size++;
      this.userTable[user.email] = userNode;
      if (this.head === null) {
        this.head = this.tail = this.owner = this.judge = userNode;
      } else {
        userNode.next = this.head;
        this.tail.next = userNode;
        this.tail = userNode;
      }
    }
  }
  removeUser (user) {
    // If the user doesn't exist in this Users object, don't do anything
    if (this.userTable[user.email]) {
      this.size--;
      if (this.head === this.tail) {
        this.head = this.tail = this.judge = this.owner = null;
      } else {
        if (this.userTable[user.email].prev) {
          this.userTable[user.email].prev.next = this.userTable[user.email].next;
        }
        if (this.userTable[user.email].next) {
          this.userTable[user.email].next.prev = this.userTable[user.email].prev;
        }
        if (this.owner === this.userTable[user.email]) {
          this.owner = this.userTable[user.email].next || this.head;
        }
        if (this.judge === this.userTable[user.email]) {
          this.judge = this.userTable[user.email].next || this.head;
        }
      }
      delete this.userTable[user.email];
    }
  }
  containsUser () {
    return !!this.userTable[user.email];
  }
  cycleJudge () {
    this.judge = this.judge.next || this.head;
  }
  getEmailsOfCurrentUsers () {
    let currentNode = this.head;
    let emailArray = [];
    while(currentNode.next) {
      emailArray.push(currentNode.email);
      currentNode = currentNode.next;
    }
    return emailArray;
  }
}

class Node {
  constructor (email, prev = null, next = null) {
    this.email = email;
    this.prev = prev;
    this.next = next;
  }
}

module.exports = Users;