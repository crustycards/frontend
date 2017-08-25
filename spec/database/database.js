const expect = require('chai').use(require('chai-as-promised')).expect;
const mockDB = require('./mockDB.json');
const db = require('../../database');
const mockDBHelpers = require('./mockDBHelpers');
const connection = db.connection;

// TODO - Break this file up into many smaller ones

describe('Models', () => {
  describe('Cardpack', () => {
    it('Should exist', () => {
      expect(db.Cardpack).to.exist;
    });
  });
  describe('Card', () => {
    it('Should exist', () => {
      expect(db.Card).to.exist;
    });
  });
  describe('CardpackSubscribe', () => {
    it('Should exist', () => {
      expect(db.CardpackSubscribe).to.exist;
    });
  });
  describe('Friend', () => {
    it('Should exist', () => {
      expect(db.Friend).to.exist;
    });
  });
  describe('Message', () => {
    it('Should exist', () => {
      expect(db.Message).to.exist;
    });
  });
});

describe('Functions', () => {
  // Forcefully sync database before testing
  before((done) => {
    db.connection.clear()
      .then(() => {
        return mockDBHelpers.createUsers();
      })
      .then(() => {
        let promises = [];
        for (let i = 0; i < mockDB.messages.length; i++) {
          promises.push(
            db.Message.create(mockDB.messages[i].senderEmail, mockDB.messages[i].receiverEmail, mockDB.messages[i].text)
          );
        }
        return Promise.all(promises);
      })
      .then(() => {
        done();
      });
  });

  after((done) => {
    db.connection.clear()
    .then(() => {
      done();
    });
  });

  describe('Export Functions', () => {
    describe('Message create()', () => {
      it('Should exist', () => {
        expect(db.Message.create).to.exist;
      });
      it('Should be a function', () => {
        expect(db.Message.create).to.be.a('function');
      });
      it('Should add messages', () => {
        let messageText = 'thisisamessage';
        return db.Message.create(mockDB.users[0].email, mockDB.users[1].email, messageText)
          .then((message) => {
            expect(message.createdAt).to.exist;
            expect(message.updatedAt).to.exist;
            expect(message.senderId).to.not.exist;
            expect(message.receiverId).to.not.exist;
            expect(message.sender).to.exist;
            expect(message.receiver).to.exist;
            expect(message.sender.id).to.equal(mockDB.users[0].id);
            expect(message.receiver.id).to.equal(mockDB.users[1].id);
            expect(message.id).to.exist;
            expect(message.text).to.equal(messageText);
          });
      });
      it('Should reject if message text is anything but a non-empty string', () => {
        return expect(db.Message.create(mockDB.users[0].email, mockDB.users[1].email, '')).to.be.rejectedWith('Expected message text to be a non-empty string');
      });
    });

    describe('Message getBetweenUsers()', () => {
      it('Should exist', () => {
        expect(db.Message.getBetweenUsers).to.exist;
      });
      it('Should be a function', () => {
        expect(db.Message.getBetweenUsers).to.be.a('function');
      });
      it('Should retrieve messages between users', () => {
        return db.Message.getBetweenUsers(mockDB.users[0].email, mockDB.users[1].email)
          .then((messages) => {
            expect(messages.length).to.equal(mockDB.messages.length + 1); // +1 because of the addMessage() tests adding a message
            for (let i = 0; i < mockDB.messages.length; i++) {
              expect(messages[i].text).to.exist;
              expect(messages[i].senderId).to.not.exist;
              expect(messages[i].receiverId).to.not.exist;
              expect(messages[i].sender).to.exist;
              expect(messages[i].receiver).to.exist;
              expect(messages[i].sender.id).to.exist;
              expect(messages[i].receiver.id).to.exist;
              expect(messages[i].text).to.equal(mockDB.messages[i].text);
              expect(messages[i].sender.email).to.equal(mockDB.messages[i].senderEmail);
              expect(messages[i].receiver.email).to.equal(mockDB.messages[i].receiverEmail);
            }
          });
      });
    });
  });

  describe('Friend sendRequest()', () => {
    it('Should exist', () => {
      expect(db.Friend.sendRequest).to.exist;
    });
    it('Should be a function', () => {
      expect(db.Friend.sendRequest).to.be.a('function');
    });
    it('Should add a friend request when there is no open request/friendship with another user', () => {
      return db.Friend.sendRequest(mockDB.users[0].email, mockDB.users[1].email)
        .then((friendshipStatus) => {
          expect(friendshipStatus.id).to.exist;
          expect(friendshipStatus.friender).to.exist;
          expect(friendshipStatus.friendee).to.exist;
          expect(friendshipStatus.frienderId).to.not.exist;
          expect(friendshipStatus.friendeeId).to.not.exist;

          expect(friendshipStatus.friender.id).to.equal(mockDB.users[0].id);
          expect(friendshipStatus.friendee.id).to.equal(mockDB.users[1].id);
          expect(friendshipStatus.friender.email).to.equal(mockDB.users[0].email);
          expect(friendshipStatus.friendee.email).to.equal(mockDB.users[1].email);
          expect(friendshipStatus.friender.firstname).to.equal(mockDB.users[0].firstname);
          expect(friendshipStatus.friendee.firstname).to.equal(mockDB.users[1].firstname);
          expect(friendshipStatus.friender.lastname).to.equal(mockDB.users[0].lastname);
          expect(friendshipStatus.friendee.lastname).to.equal(mockDB.users[1].lastname);
          expect(friendshipStatus.accepted).to.equal(false);
        });
    });
    it('Should not add a duplicate friend request and reject when attempted', () => {
      return expect(db.Friend.sendRequest(mockDB.users[0].email, mockDB.users[1].email)).to.be.rejected;
    });
    it('Should not allow sending friend requests to users who have sent friend requests to you', () => {
      return expect(db.Friend.sendRequest(mockDB.users[0].email, mockDB.users[1].email)).to.be.rejected;
    });
  });

  describe('Friend acceptRequest()', () => {
    it('Should exist', () => {
      expect(db.Friend.acceptRequest).to.exist;
    });
    it('Should be a function', () => {
      expect(db.Friend.acceptRequest).to.be.a('function');
    });
    it('Should not accept a request that does not exist', () => {
      return expect(db.Friend.acceptRequest(mockDB.users[1].email, mockDB.users[2].email)).to.be.rejected;
    });
    it('Should not accept a request that was sent by the acceptor', () => {
      return expect(db.Friend.acceptRequest(mockDB.users[0].email, mockDB.users[1].email)).to.be.rejected;
    });
    it('Should accept friend requests from other users', () => {
      return db.Friend.acceptRequest(mockDB.users[1].email, mockDB.users[0].email)
        .then((friendshipStatus) => {
          expect(friendshipStatus).to.exist;
          expect(friendshipStatus.friender).to.exist;
          expect(friendshipStatus.friendee).to.exist;
          expect(friendshipStatus.frienderId).to.not.exist;
          expect(friendshipStatus.friendeeId).to.not.exist;

          expect(friendshipStatus.friender.id).to.equal(mockDB.users[1].id);
          expect(friendshipStatus.friendee.id).to.equal(mockDB.users[0].id);
          expect(friendshipStatus.friender.email).to.equal(mockDB.users[1].email);
          expect(friendshipStatus.friendee.email).to.equal(mockDB.users[0].email);
          expect(friendshipStatus.friender.firstname).to.equal(mockDB.users[1].firstname);
          expect(friendshipStatus.friendee.firstname).to.equal(mockDB.users[0].firstname);
          expect(friendshipStatus.friender.lastname).to.equal(mockDB.users[1].lastname);
          expect(friendshipStatus.friendee.lastname).to.equal(mockDB.users[0].lastname);
          expect(friendshipStatus.accepted).to.equal(true);
        });
    });
  });

  describe('Friend get()', () => {
    it('Should exist', () => {
      expect(db.Friend.get).to.exist;
    });
    it('Should be a function', () => {
      expect(db.Friend.get).to.be.a('function');
    });
    it('Should return correct data', () => {
      return db.Friend.get('hello@world.com')
        .then((friendData) => {
          expect(friendData).to.exist;
          expect(friendData.friends).to.exist;
          expect(friendData.requestsSent).to.exist;
          expect(friendData.requestsReceived).to.exist;

          // TODO - Add more extensive testing for friend-related functions
          // TODO - Add test to make sure that when deleting a cardpack, all linked cards are deleted as well
          expect(friendData.friends[0].id).to.equal(mockDB.users[1].id);
          expect(friendData.friends[0].email).to.equal(mockDB.users[1].email);
          expect(friendData.friends[0].firstname).to.equal(mockDB.users[1].firstname);
          expect(friendData.friends[0].lastname).to.equal(mockDB.users[1].lastname);
        });
    });
  });

  describe('Friend remove()', () => {
    it('Should exist', () => {
      expect(db.Friend.remove).to.exist;
    });
    it('Should be a function', () => {
      expect(db.Friend.remove).to.be.a('function');
    });
    it('Should reject when attempting to remove friendship between users who are not friends', () => {
      return expect(db.Friend.remove(mockDB.users[0].email, mockDB.users[3].email)).to.be.rejected;
    });
    it('Should remove a friendship', () => {
      return db.Friend.remove(mockDB.users[0].email, mockDB.users[1].email)
        .then((response) => {
          expect(response).to.exist;
          expect(response).to.equal(true);
        });
    });
    // it('Should remove a sent friend request', () => {
    //   //
    // });
    // it('Should remove a received friend request', () => {
    //   //
    // });
  });

  describe('Cardpack create()', () => {
    it('Should exist', () => {
      expect(db.Cardpack.create).to.exist;
    });
    it('Should be a function', () => {
      expect(db.Cardpack.create).to.be.a('function');
    });
    it('Should create a cardpack when given an existing user', () => {
      let cardpackName = 'testcardpack';
      let ownerEmail = mockDB.users[0].email;
      return db.Cardpack.create(ownerEmail, cardpackName)
        .then((cardpack) => {
          expect(cardpack).to.exist;
          expect(cardpack.createdAt).to.exist;
          expect(cardpack.updatedAt).to.exist;
          expect(cardpack.ownerId).to.not.exist;
          expect(cardpack.owner).to.exist;

          expect(cardpack.owner.email).to.equal(ownerEmail);
          expect(cardpack.name).to.equal(cardpackName);
        });
    });
    it('Should create a cardpack of the same name as a previous cardpack and the same user', () => {
      let cardpackName = 'testcardpack';
      let ownerEmail = mockDB.users[0].email;
      return db.Cardpack.create(ownerEmail, cardpackName)
        .then((cardpack) => {
          expect(cardpack).to.exist;
          expect(cardpack.createdAt).to.exist;
          expect(cardpack.updatedAt).to.exist;
          expect(cardpack.ownerId).to.not.exist;
          expect(cardpack.owner).to.exist;

          expect(cardpack.owner.email).to.equal(ownerEmail);
          expect(cardpack.name).to.equal(cardpackName);
        });
    });
    it('Should not create a cardpack when given a non-existing user', () => {
      let cardpackName = 'testcardpack';
      let ownerEmail = 'notarealemail@fakesite.com';
      return expect(db.Cardpack.create(ownerEmail, cardpackName)).to.be.rejected;
    });
    it('Should not create a cardpack when given an empty string as a cardpack name', () => {
      let cardpackName = '';
      let ownerEmail = mockDB.users[1].email;
      return expect(db.Cardpack.create(ownerEmail, cardpackName)).to.be.rejected;
    });
  });

  describe('Cardpack getByUserEmail()', () => {
    it('Should exist', () => {
      expect(db.Cardpack.getByUserEmail).to.exist;
    });
    it('Should be a function', () => {
      expect(db.Cardpack.getByUserEmail).to.be.a('function');
    });
    it('Should resolve to empty array for user that has no cardpacks', () => {
      return expect(db.Cardpack.getByUserEmail(mockDB.users[3].email)).to.eventually.deep.equal([]);
    });
    it('Should resolve to an array of cardpacks for users that have cardpacks', () => {
      return db.Cardpack.getByUserEmail(mockDB.users[0].email)
        .then((cardpacks) => {
          expect(cardpacks).to.exist;
          expect(cardpacks.constructor).to.equal(Array);
          expect(cardpacks.length).to.equal(2);
          expect(cardpacks[0].name).to.equal('testcardpack');
          expect(cardpacks[1].name).to.equal('testcardpack');
          expect(cardpacks[0].ownerId).to.not.exist;
          expect(cardpacks[1].ownerId).to.not.exist;
          expect(cardpacks[0].owner).to.exist;
          expect(cardpacks[1].owner).to.exist;
          expect(cardpacks[0].owner.email).to.equal(mockDB.users[0].email);
          expect(cardpacks[1].owner.email).to.equal(mockDB.users[0].email);
        });
    });
  });

  describe('Cardpack getById()', () => {
    it('Should exist', () => {
      expect(db.Cardpack.getById).to.exist;
    });
    it('Should be a function', () => {
      expect(db.Cardpack.getById).to.be.a('function');
    });
    it('Should retrieve cardpack properly when using a valid cardpack ID', () => {
      return db.Cardpack.getById(2)
        .then((cardpack) => {
          expect(cardpack).to.exist;
          expect(cardpack.ownerId).to.not.exist;
          expect(cardpack.owner).to.exist;
        });
    });
    it('Should retrieve cardpack properly when using a valid cardpack ID', () => {
      return expect(db.Cardpack.getById(1234)).to.be.rejected;
    });
  });

  describe('Cardpack delete()', () => {
    it('Should exist', () => {
      expect(db.Cardpack.delete).to.exist;
    });
    it('Should be a function', () => {
      expect(db.Cardpack.delete).to.be.a('function');
    });
    it('Should reject when trying to delete a cardpack that exists but is owned by someone else', () => {
      return expect(db.Cardpack.delete(mockDB.users[1].email, 1)).to.be.rejected;
    });
    it('Should reject when trying to delete a cardpack that does not exist', () => {
      return expect(db.Cardpack.delete(mockDB.users[1].email, 999)).to.be.rejected;
    });
    it('Should resolve to true when trying to delete a cardpack that you own', () => {
      return expect(db.Cardpack.delete(mockDB.users[0].email, 1)).to.eventually.equal(true);
    });
  });

  let cardId;
  let cardOwnerEmail = mockDB.users[0].email;
  describe('Cardpack create()', () => {
    let cardpackId;
    before(() => {
      return db.Cardpack.create(cardOwnerEmail, 'Cardpack')
        .then((cardpack) => {
          cardpackId = cardpack.id;
        });
    });

    it('Should create a black card', () => {
      return db.Card.create(cardOwnerEmail, cardpackId, 'test card', 'black')
        .then((card) => {
          cardId = card.id;
          expect(card).to.exist;
          expect(card.createdAt).to.exist;
          expect(card.updatedAt).to.exist;
          expect(card.cardpackId).to.not.exist;
          expect(card.cardpack).to.exist;
          expect(card.cardpack.id).to.equal(cardpackId);
          expect(card.text).to.equal('test card');
          expect(card.type).to.equal('black');
        });
    });
    it('Should create a white card', () => {
      return db.Card.create(cardOwnerEmail, cardpackId, 'test card 2', 'white')
        .then((card) => {
          expect(card).to.exist;
          expect(card.createdAt).to.exist;
          expect(card.updatedAt).to.exist;
          expect(card.cardpackId).to.not.exist;
          expect(card.cardpack).to.exist;
          expect(card.cardpack.id).to.equal(cardpackId);
          expect(card.text).to.equal('test card 2');
          expect(card.type).to.equal('white');
        });
    });
    it('Should not create a card if the card type is invalid', () => {
      return expect(db.Cardpack.create(cardOwnerEmail, cardpackId, 'test', 'invalidcardtype')).to.be.rejected;
    });
    it('Should not create a card if the card text is blank', () => {
      return expect(db.Cardpack.create(cardOwnerEmail, cardpackId, '', 'white')).to.be.rejected;
    });
    it('Should not create a card if the cardpack ID doesn\'t map to an existing cardpack', () => {
      return expect(db.Cardpack.create(cardOwnerEmail, cardpackId + 1, 'test', 'white')).to.be.rejected;
    });
    it('Should not create a card if the card creator is not the cardpack owner', () => {
      return expect(db.Cardpack.create(mockDB.users[1].email, cardpackId, 'test', 'white')).to.be.rejected;
    });
  });

  describe('Card update()', () => {
    it('Should modify an existing card', () => {
      return db.Card.update(cardOwnerEmail, cardId, 'updated card name')
        .then((card) => {
          expect(card).to.exist;
          expect(card.createdAt).to.exist;
          expect(card.updatedAt).to.exist;
          expect(card.id).to.equal(cardId);
          expect(card.text).to.equal('updated card name');
        });
    });
    it('Should modify a previously modified card', () => {
      return db.Card.update(cardOwnerEmail, cardId, 'twice updated card name')
        .then((card) => {
          expect(card).to.exist;
          expect(card.createdAt).to.exist;
          expect(card.updatedAt).to.exist;
          expect(card.id).to.equal(cardId);
          expect(card.text).to.equal('twice updated card name');
        });
    });
    it('Should reject when modifying a card using an email that is not tied to a user', () => {
      return expect(db.Card.update('thisisafake@email.com', cardId, 'thrice updated card name')).to.be.rejected;
    });
    it('Should reject when modifying a card that is not owned by the user modifying the card', () => {
      return expect(db.Card.update(mockDB.users[1].email, cardId, 'thrice updated card name')).to.be.rejected;
    });
    it('Should reject when passing in a card ID that does not map to an existing card', () => {
      return expect(db.Card.update(cardOwnerEmail, 123456789, 'thrice updated card name')).to.be.rejectedWith('Card ID does not map to an existing card');
    });
    it('Should reject when changing card text to a blank string', () => {
      return expect(db.Card.update(cardOwnerEmail, cardId, '')).to.be.rejectedWith('Card should be a non-empty string');
    });
  });

  describe('Card delete()', () => {
    it('Should reject when deleting a card you do not own', () => {
      return expect(db.Card.delete(mockDB.users[1].email, cardId)).to.be.rejectedWith('User does not own this card');
    });
    it('Should reject when deleting a card that does not exist', () => {
      return expect(db.Card.delete(cardOwnerEmail, 123456789)).to.be.rejectedWith('Card ID does not map to an existing card');
    });
    it('Should delete a card when all parameters are valid', () => {
      return db.Card.delete(cardOwnerEmail, cardId)
        .then((deletedCard) => {
          expect(deletedCard).to.exist;
        });
    });
  });

  describe('Cardpack create()', () => {
    before(() => {
      return db.Cardpack.create(mockDB.users[2].email, 'testcardpack')
        .then((cardpack) => {
          cardpackId = cardpack.id;
          return db.Card.create(mockDB.users[2].email, cardpackId, 'testcard', 'white');
        })
        .then(() => {
          return db.Card.create(mockDB.users[2].email, cardpackId, 'testcard2', 'black');
        });
    });

    it('Should get cards for a cardpack', () => {
      return db.Card.getByCardpackId(cardpackId)
        .then((cards) => {
          expect(cards.length).to.equal(2);
        });
    });
  });
});