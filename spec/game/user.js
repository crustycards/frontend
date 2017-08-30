const expect = require('chai').use(require('chai-as-promised')).expect;
const Users = require('../../games/Users.js');

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
    expect(() => {users.addUser(userOne)}).to.throw(Error, 'You are already in this game');
    users.addUser(userTwo);
    expect(users.size()).to.equal(2);
    expect(() => {users.addUser(userTwo)}).to.throw(Error, 'You are already in this game');
    users.addUser(userThree);
    expect(users.size()).to.equal(3);
    expect(() => {users.addUser(userThree)}).to.throw(Error, 'You are already in this game');
    users.addUser(userFour);
    expect(users.size()).to.equal(4);
  });
  it('Should return true when adding a user that is not in the game and throw an error when adding a user that is already in the game', () => {
    expect(users.addUser(userOne)).to.equal(true);
    expect(() => {users.addUser(userOne)}).to.throw(Error, 'You are already in this game');
    expect(users.addUser(userTwo)).to.equal(true);
    expect(() => {users.addUser(userTwo)}).to.throw(Error, 'You are already in this game');
    expect(users.addUser(userThree)).to.equal(true);
    expect(() => {users.addUser(userThree)}).to.throw(Error, 'You are already in this game');
    expect(users.addUser(userFour)).to.equal(true);
    expect(() => {users.addUser(userFour)}).to.throw(Error, 'You are already in this game');
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

  it('Should save a player\'s hand if passed in when adding a user', () => {
    users.addUser(userOne, cards);
    expect(users.getHand(userOne)).to.equal(cards);
  });
  it('Should be able to play a card that exists in a player\'s hand and return it', () => {
    let hand = JSON.parse(JSON.stringify(cards));
    users.addUser(userOne, hand);
    expect(users.playCard(userOne, cards[0])).to.eql(cards[0]);
    expect(users.getHand(userOne).length).to.equal(cards.length - 1);
  });
  it('Should return undefined when attempting to play a card from a user\'s hand that does not exist', () => {
    let hand = JSON.parse(JSON.stringify(cards));
    let fakeCard = {id: 4321, name: 'fakecard'};
    users.addUser(userOne, hand);
    expect(users.playCard(userOne, fakeCard)).to.not.exist;
    expect(users.getHand(userOne).length).to.equal(cards.length);
  });
  it('Should be able to draw a card for a user', () => {
    let hand = JSON.parse(JSON.stringify(cards));
    let newCard = {id: 1234, name: 'thisisatestcard'};
    users.addUser(userOne, hand);
    users.drawCard(userOne, newCard);
    let userHand = users.getHand(userOne);
    expect(userHand[userHand.length - 1]).to.eql(newCard);
  });
  it('Should return a user\'s hand when removing that user', () => {
    users.addUser(userOne, cards);
    expect(users.removeUser(userOne)).to.equal(cards);
  });

  it('Should manage user\'s score', () => {
    users.addUser(userOne);
    expect(users.getScore(userOne)).to.equal(0);
    users.incrementScore(userOne);
    expect(users.getScore(userOne)).to.equal(1);
    users.incrementScore(userOne);
    expect(users.getScore(userOne)).to.equal(2);
  });
});