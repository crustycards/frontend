const expect = require('chai').use(require('chai-as-promised')).expect;
const {User, Message, connection} = require('../../database');
const mockDB = require('./mockDB.json');
const mockDBHelpers = require('./mockDBHelpers');

describe('Message', () => {
  beforeEach(() => {
    return connection.clear()
      .then(() => {
        return mockDBHelpers.createUsers();
      });
  });

  it('Should exist', () => {
    expect(Message.model).to.exist;
  });
  describe('create()', () => {
    it('Should exist', () => {
      expect(Message.create).to.exist;
    });
    it('Should be a function', () => {
      expect(Message.create).to.be.a('function');
    });
    it('Should add messages', () => {
      let userOne = mockDB.users[0];
      let userTwo = mockDB.users[1];
      let messageText = 'thisisamessage';
      return Message.create(userOne.email, userTwo.email, messageText)
        .then((message) => {
          expect(message.createdAt).to.exist;
          expect(message.updatedAt).to.exist;
          expect(message.senderId).to.not.exist;
          expect(message.receiverId).to.not.exist;
          // TODO - Fix so sender and receiver SHOULD exist
          expect(message.sender).to.exist;
          expect(message.receiver).to.exist;
          expect(message.sender.id).to.equal(userOne.id);
          expect(message.receiver.id).to.equal(userTwo.id);
          expect(message.id).to.exist;
          expect(message.text).to.equal(messageText);
        });
    });
    it('Should reject if message text is anything but a non-empty string', () => {
      let userOne = mockDB.users[0];
      let userTwo = mockDB.users[1];
      let messageText = '';
      return expect(Message.create(userOne.email, userTwo.email, messageText)).to.be.rejectedWith('Expected message text to be a non-empty string');
    });
  });

  describe('getBetweenUsers()', () => {
    it('Should exist', () => {
      expect(Message.getBetweenUsers).to.exist;
    });
    it('Should be a function', () => {
      expect(Message.getBetweenUsers).to.be.a('function');
    });
    it('Should retrieve messages between users', () => {
      let userOne = mockDB.users[0];
      let userTwo = mockDB.users[1];
      let messageText = 'thisisamessage';
      return Message.create(userOne.email, userTwo.email, messageText)
        .then(() => {
          return Message.getBetweenUsers(userOne.email, userTwo.email)
            .then((messages) => {
              expect(messages.length).to.equal(1);
              expect(messages[0].text).to.exist;
              expect(messages[0].senderId).to.not.exist;
              expect(messages[0].receiverId).to.not.exist;
              expect(messages[0].sender).to.exist;
              expect(messages[0].receiver).to.exist;
              expect(messages[0].sender.id).to.exist;
              expect(messages[0].receiver.id).to.exist;
              expect(messages[0].text).to.equal(messageText);
              expect(messages[0].sender.email).to.equal(userOne.email);
              expect(messages[0].receiver.email).to.equal(userTwo.email);
            });
        });
    });
  });
});