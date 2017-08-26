const expect = require('chai').use(require('chai-as-promised')).expect;
const {Friend, User, connection} = require('../../database');
const mockDB = require('./mockDB.json');
const mockDBHelpers = require('./mockDBHelpers');

describe('Friend', () => {
  beforeEach(() => {
    return connection.clear()
      .then(() => {
        return mockDBHelpers.createUsers();
      });
  });

  it('Should exist', () => {
    expect(Friend.model).to.exist;
  });
  describe('sendRequest()', () => {
    it('Should exist', () => {
      expect(Friend.sendRequest).to.exist;
    });
    it('Should be a function', () => {
      expect(Friend.sendRequest).to.be.a('function');
    });
    it('Should add a friend request when there is no open request/friendship with another user', () => {
      let userOne = mockDB.users[0];
      let userTwo = mockDB.users[1];
      return Friend.sendRequest(userOne.email, userTwo.email)
        .then((friendshipStatus) => {
          expect(friendshipStatus.id).to.exist;
          expect(friendshipStatus.friender).to.exist;
          expect(friendshipStatus.friendee).to.exist;
          expect(friendshipStatus.frienderId).to.not.exist;
          expect(friendshipStatus.friendeeId).to.not.exist;
          expect(friendshipStatus.friender.id).to.equal(userOne.id);
          expect(friendshipStatus.friendee.id).to.equal(userTwo.id);
          expect(friendshipStatus.friender.email).to.equal(userOne.email);
          expect(friendshipStatus.friendee.email).to.equal(userTwo.email);
          expect(friendshipStatus.friender.firstname).to.equal(userOne.firstname);
          expect(friendshipStatus.friendee.firstname).to.equal(userTwo.firstname);
          expect(friendshipStatus.friender.lastname).to.equal(userOne.lastname);
          expect(friendshipStatus.friendee.lastname).to.equal(userTwo.lastname);
          expect(friendshipStatus.accepted).to.equal(false);
        });
    });
    // TODO - Check these two tests below
    it('Should reject when adding a duplicate friend request', () => {
      let userOne = mockDB.users[0];
      let userTwo = mockDB.users[1];
      return Friend.sendRequest(userOne.email, userTwo.email)
        .then(() => {
          return expect(Friend.sendRequest(userOne.email, userTwo.email)).to.be.rejected;
        });
    });
    it('Should not allow sending friend requests to users who have sent friend requests to you', () => {
      let userOne = mockDB.users[0];
      let userTwo = mockDB.users[1];
      return Friend.sendRequest(userOne.email, userTwo.email)
        .then(() => {
          return expect(Friend.sendRequest(userTwo.email, userOne.email)).to.be.rejected;
        });
    });
  });
  
  describe('acceptRequest()', () => {
    it('Should exist', () => {
      expect(Friend.acceptRequest).to.exist;
    });
    it('Should be a function', () => {
      expect(Friend.acceptRequest).to.be.a('function');
    });
    it('Should not accept a request that does not exist', () => {
      return expect(Friend.acceptRequest(mockDB.users[1].email, mockDB.users[2].email)).to.be.rejected;
    });
    it('Should not accept a request that was sent by the acceptor', () => {
      let userOne = mockDB.users[0];
      let userTwo = mockDB.users[1];
      return Friend.sendRequest(userOne.email, userTwo.email)
        .then(() => {
          return expect(Friend.acceptRequest(userOne.email, userTwo.email)).to.be.rejected;
        });
    });
    it('Should accept friend requests from other users', () => {
      let userOne = mockDB.users[0];
      let userTwo = mockDB.users[1];
      return Friend.sendRequest(userOne.email, userTwo.email)
        .then(() => {
          return Friend.acceptRequest(userTwo.email, userOne.email)
            .then((friendshipStatus) => {
              expect(friendshipStatus).to.exist;
              expect(friendshipStatus.friender).to.exist;
              expect(friendshipStatus.friendee).to.exist;
              expect(friendshipStatus.frienderId).to.not.exist;
              expect(friendshipStatus.friendeeId).to.not.exist;
      
              expect(friendshipStatus.friender.id).to.equal(userTwo.id);
              expect(friendshipStatus.friendee.id).to.equal(userOne.id);
              expect(friendshipStatus.friender.email).to.equal(userTwo.email);
              expect(friendshipStatus.friendee.email).to.equal(userOne.email);
              expect(friendshipStatus.friender.firstname).to.equal(userTwo.firstname);
              expect(friendshipStatus.friendee.firstname).to.equal(userOne.firstname);
              expect(friendshipStatus.friender.lastname).to.equal(userTwo.lastname);
              expect(friendshipStatus.friendee.lastname).to.equal(userOne.lastname);
              expect(friendshipStatus.accepted).to.equal(true);
            });
        });
    });
  });
  
  describe('get()', () => {
    it('Should exist', () => {
      expect(Friend.get).to.exist;
    });
    it('Should be a function', () => {
      expect(Friend.get).to.be.a('function');
    });
    it('Should return correct data', () => {
      let userOne = mockDB.users[0];
      let userTwo = mockDB.users[1];
      let userThree = mockDB.users[2];
      return Friend.sendRequest(userOne.email, userTwo.email)
        .then(() => {
          return Friend.acceptRequest(userTwo.email, userOne.email);
        })
        .then(() => {
          return Friend.sendRequest(userOne.email, userThree.email);
        })
        .then(() => {
          return Friend.get(userOne.email);
        })
        .then((friendData) => {
          expect(friendData).to.exist;
          expect(friendData.friends).to.exist;
          expect(friendData.requestsSent).to.exist;
          expect(friendData.requestsReceived).to.exist;
          expect(friendData.friends).to.be.a('array');
          expect(friendData.requestsSent).to.be.a('array');
          expect(friendData.requestsReceived).to.be.a('array');
          expect(friendData.friends[0].id).to.equal(userTwo.id);
          expect(friendData.friends[0].email).to.equal(userTwo.email);
          expect(friendData.friends[0].firstname).to.equal(userTwo.firstname);
          expect(friendData.friends[0].lastname).to.equal(userTwo.lastname);
        });
    });
  });
  
  describe('remove()', () => {
    it('Should exist', () => {
      expect(Friend.remove).to.exist;
    });
    it('Should be a function', () => {
      expect(Friend.remove).to.be.a('function');
    });
    it('Should reject when attempting to remove friendship between users who are not friends', () => {
      return expect(Friend.remove(mockDB.users[0].email, mockDB.users[3].email)).to.be.rejected;
    });
    it('Should remove a friendship', () => {
      let userOne = mockDB.users[0];
      let userTwo = mockDB.users[1];
      return Friend.sendRequest(userOne.email, userTwo.email)
        .then(() => {
          return Friend.acceptRequest(userTwo.email, userOne.email);
        })
        .then(() => {
          return Friend.remove(userOne.email, userTwo.email)
            .then((response) => {
              expect(response).to.exist;
              expect(response).to.equal(true);
            });
        });
    });
    // TODO - Implement these tests
    // it('Should remove a sent friend request', () => {
    //   //
    // });
    // it('Should remove a received friend request', () => {
    //   //
    // });
  });
});