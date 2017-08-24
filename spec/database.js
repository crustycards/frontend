const expect = require('chai').use(require('chai-as-promised')).expect;
const db = require('./mockDB.json');
const dbExports = require('../database/index.js');
const sequelize = dbExports.sequelize;
const models = require('../database/models.js')(sequelize);

describe('Models', () => {
  describe('Users', () => {
    it('Should exist', () => {
      expect(models.users).to.exist;
    });
  });
  describe('Cardpacks', () => {
    it('Should exist', () => {
      expect(models.cardpacks).to.exist;
    });
  });
  describe('Cards', () => {
    it('Should exist', () => {
      expect(models.cards).to.exist;
    });
  });
  describe('CardpackJoinTable', () => {
    it('Should exist', () => {
      expect(models.cardpackjointable).to.exist;
    });
  });
  describe('Friends', () => {
    it('Should exist', () => {
      expect(models.friends).to.exist;
    });
  });
  describe('Messages', () => {
    it('Should exist', () => {
      expect(models.messages).to.exist;
    });
  });
});

describe('Functions', () => {
  // Forcefully sync database before testing
  before(() => {
    return sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(() => {
      return sequelize.sync({force: true});
    })
    .then(() => {
      return sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    })
    .then(() => {
      return sequelize.sync();
    })
    .then(() => {
      let promises = [];
      for (let i = 0; i < db.users.length; i++) {
        promises.push(
          models.users.create(db.users[i])
        );
      }
      for (let i = 0; i < db.messages.length; i++) {
        promises.push(
          models.messages.create(db.messages[i])
        );
      }
      return Promise.all(promises);
    });
  });

  after(() => {
    return sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(() => {
      return sequelize.sync({force: true});
    })
    .then(() => {
      return sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    })
    .then(() => {
      return sequelize.sync();
    });
  });

  describe('Export Functions', () => {
    describe('getUserByEmail()', () => {
      it('Should exist', () => {
        expect(dbExports.getUser).to.exist;
      });
      it('Should be a function', () => {
        expect(dbExports.getUser).to.be.a('function');
      });
      it('Should retrieve a user if they exist', () => {
        let promise = dbExports.getUser(db.users[0].email)
        .then((user) => {
          expect(user.createdAt).to.exist;
          expect(user.updatedAt).to.exist;
          expect(user.password).to.not.exist;
          delete user.createdAt;
          delete user.updatedAt;
          return user;
        });
        return expect(promise).to.eventually.deep.equal(db.users[0]);
      });
      it('Should reject if a user does not exist', () => {
        let fakeEmail = 'thisisafakeemail'
        return expect(dbExports.getUser(fakeEmail)).to.be.rejectedWith('No user is registered under ' + fakeEmail);
      });
    });

    describe('addMessage()', () => {
      it('Should exist', () => {
        expect(dbExports.addMessage).to.exist;
      });
      it('Should be a function', () => {
        expect(dbExports.addMessage).to.be.a('function');
      });
      it('Should add messages', () => {
        let messageText = 'thisisamessage';
        return dbExports.addMessage(db.users[0].email, db.users[1].email, messageText)
        .then((message) => {
          expect(message.createdAt).to.exist;
          expect(message.updatedAt).to.exist;
          expect(message.sender_id).to.not.exist;
          expect(message.receiver_id).to.not.exist;
          expect(message.sender).to.exist;
          expect(message.receiver).to.exist;
          expect(message.sender.id).to.equal(db.users[0].id);
          expect(message.receiver.id).to.equal(db.users[1].id);
          expect(message.id).to.exist;
          expect(message.text).to.equal(messageText);
        });
      });
      it('Should reject if message text is anything but a non-empty string', () => {
        return expect(dbExports.addMessage(db.users[0].email, db.users[1].email, '')).to.be.rejectedWith('Expected message text to be a non-empty string');
      });
    });

    describe('getMessages()', () => {
      it('Should exist', () => {
        expect(dbExports.getMessages).to.exist;
      });
      it('Should be a function', () => {
        expect(dbExports.getMessages).to.be.a('function');
      });
      it('Should retrieve messages between users', () => {
        return dbExports.getMessages(db.users[0].email, db.users[1].email)
        .then((messages) => {
          expect(messages.length).to.equal(db.messages.length + 1); // +1 because of the addMessage() tests adding a message
          for (let i = 0; i < db.messages.length; i++) {
            expect(messages[i].text).to.exist;
            expect(messages[i].sender_id).to.not.exist;
            expect(messages[i].receiver_id).to.not.exist;
            expect(messages[i].sender).to.exist;
            expect(messages[i].receiver).to.exist;
            expect(messages[i].sender.id).to.exist;
            expect(messages[i].receiver.id).to.exist;
            expect(messages[i].text).to.equal(db.messages[i].text);
            expect(messages[i].sender.id).to.equal(db.messages[i].sender_id);
            expect(messages[i].receiver.id).to.equal(db.messages[i].receiver_id);
          }
        });
      });
    });
  });

  describe('sendFriendRequest()', () => {
    it('Should exist', () => {
      expect(dbExports.sendFriendRequest).to.exist;
    });
    it('Should be a function', () => {
      expect(dbExports.sendFriendRequest).to.be.a('function');
    });
    it('Should add a friend request when there is no open request/friendship with another user', () => {
      return dbExports.sendFriendRequest(db.users[0].email, db.users[1].email)
      .then((friendshipStatus) => {
        expect(friendshipStatus.id).to.exist;
        expect(friendshipStatus.friender).to.exist;
        expect(friendshipStatus.friendee).to.exist;
        expect(friendshipStatus.friender_id).to.not.exist;
        expect(friendshipStatus.friendee_id).to.not.exist;

        expect(friendshipStatus.friender.id).to.equal(db.users[0].id);
        expect(friendshipStatus.friendee.id).to.equal(db.users[1].id);
        expect(friendshipStatus.friender.email).to.equal(db.users[0].email);
        expect(friendshipStatus.friendee.email).to.equal(db.users[1].email);
        expect(friendshipStatus.friender.firstname).to.equal(db.users[0].firstname);
        expect(friendshipStatus.friendee.firstname).to.equal(db.users[1].firstname);
        expect(friendshipStatus.friender.lastname).to.equal(db.users[0].lastname);
        expect(friendshipStatus.friendee.lastname).to.equal(db.users[1].lastname);
        expect(friendshipStatus.accepted).to.equal(false);
      });
    });
    it('Should not add a duplicate friend request and reject when attempted', () => {
      return expect(dbExports.sendFriendRequest(db.users[0].email, db.users[1].email)).to.be.rejected;
    });
    it('Should not allow sending friend requests to users who have sent friend requests to you', () => {
      return expect(dbExports.sendFriendRequest(db.users[0].email, db.users[1].email)).to.be.rejected;
    });
  });

  describe('acceptFriendRequest()', () => {
    it('Should exist', () => {
      expect(dbExports.acceptFriendRequest).to.exist;
    });
    it('Should be a function', () => {
      expect(dbExports.acceptFriendRequest).to.be.a('function');
    });
    it('Should not accept a request that does not exist', () => {
      return expect(dbExports.acceptFriendRequest(db.users[1].email, db.users[2].email)).to.be.rejected;
    });
    it('Should not accept a request that was sent by the acceptor', () => {
      return expect(dbExports.acceptFriendRequest(db.users[0].email, db.users[1].email)).to.be.rejected;
    });
    it('Should accept friend requests from other users', () => {
      return dbExports.acceptFriendRequest(db.users[1].email, db.users[0].email)
      .then((friendshipStatus) => {
        expect(friendshipStatus).to.exist;
        expect(friendshipStatus.friender).to.exist;
        expect(friendshipStatus.friendee).to.exist;
        expect(friendshipStatus.friender_id).to.not.exist;
        expect(friendshipStatus.friendee_id).to.not.exist;

        expect(friendshipStatus.friender.id).to.equal(db.users[1].id);
        expect(friendshipStatus.friendee.id).to.equal(db.users[0].id);
        expect(friendshipStatus.friender.email).to.equal(db.users[1].email);
        expect(friendshipStatus.friendee.email).to.equal(db.users[0].email);
        expect(friendshipStatus.friender.firstname).to.equal(db.users[1].firstname);
        expect(friendshipStatus.friendee.firstname).to.equal(db.users[0].firstname);
        expect(friendshipStatus.friender.lastname).to.equal(db.users[1].lastname);
        expect(friendshipStatus.friendee.lastname).to.equal(db.users[0].lastname);
        expect(friendshipStatus.accepted).to.equal(true);
      });
    });
  });

  describe('getFriendData()', () => {
    it('Should exist', () => {
      expect(dbExports.getFriendData).to.exist;
    });
    it('Should be a function', () => {
      expect(dbExports.getFriendData).to.be.a('function');
    });
    it('Should return correct data', () => {
      return dbExports.getFriendData('hello@world.com')
      .then((friendData) => {
        expect(friendData).to.exist;
        expect(friendData.friends).to.exist;
        expect(friendData.requestsSent).to.exist;
        expect(friendData.requestsReceived).to.exist;

        // TODO - Add more extensive testing for friend-related functions
        // TODO - Add test to make sure that when deleting a cardpack, all linked cards are deleted as well
        expect(friendData.friends[0].id).to.equal(db.users[1].id);
        expect(friendData.friends[0].email).to.equal(db.users[1].email);
        expect(friendData.friends[0].firstname).to.equal(db.users[1].firstname);
        expect(friendData.friends[0].lastname).to.equal(db.users[1].lastname);
      });
    });
  });

  describe('removeFriend()', () => {
    it('Should exist', () => {
      expect(dbExports.removeFriend).to.exist;
    });
    it('Should be a function', () => {
      expect(dbExports.removeFriend).to.be.a('function');
    });
    it('Should reject when attempting to remove friendship between users who are not friends', () => {
      return expect(dbExports.removeFriend(db.users[0].email, db.users[3].email)).to.be.rejected;
    });
    it('Should remove a friendship', () => {
      return dbExports.removeFriend(db.users[0].email, db.users[1].email)
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

  describe('createCardpack()', () => {
    it('Should exist', () => {
      expect(dbExports.createCardpack).to.exist;
    });
    it('Should be a function', () => {
      expect(dbExports.createCardpack).to.be.a('function');
    });
    it('Should create a cardpack when given an existing user', () => {
      let cardpackName = 'testcardpack';
      let ownerEmail = db.users[0].email;
      return dbExports.createCardpack(ownerEmail, cardpackName)
      .then((cardpack) => {
        expect(cardpack).to.exist;
        expect(cardpack.createdAt).to.exist;
        expect(cardpack.updatedAt).to.exist;
        expect(cardpack.owner_user_id).to.not.exist;
        expect(cardpack.owner).to.exist;

        expect(cardpack.owner.email).to.equal(ownerEmail);
        expect(cardpack.name).to.equal(cardpackName);
      });
    });
    it('Should create a cardpack of the same name as a previous cardpack and the same user', () => {
      let cardpackName = 'testcardpack';
      let ownerEmail = db.users[0].email;
      return dbExports.createCardpack(ownerEmail, cardpackName)
      .then((cardpack) => {
        expect(cardpack).to.exist;
        expect(cardpack.createdAt).to.exist;
        expect(cardpack.updatedAt).to.exist;
        expect(cardpack.owner_user_id).to.not.exist;
        expect(cardpack.owner).to.exist;

        expect(cardpack.owner.email).to.equal(ownerEmail);
        expect(cardpack.name).to.equal(cardpackName);
      });
    });
    it('Should not create a cardpack when given a non-existing user', () => {
      let cardpackName = 'testcardpack';
      let ownerEmail = 'notarealemail@fakesite.com';
      return expect(dbExports.createCardpack(ownerEmail, cardpackName)).to.be.rejected;
    });
    it('Should not create a cardpack when given an empty string as a cardpack name', () => {
      let cardpackName = '';
      let ownerEmail = db.users[1].email;
      return expect(dbExports.createCardpack(ownerEmail, cardpackName)).to.be.rejected;
    });
  });

  describe('getCardpacks()', () => {
    it('Should exist', () => {
      expect(dbExports.getCardpacks).to.exist;
    });
    it('Should be a function', () => {
      expect(dbExports.getCardpacks).to.be.a('function');
    });
    it('Should resolve to empty array for user that has no cardpacks', () => {
      return expect(dbExports.getCardpacks(db.users[3].email)).to.eventually.deep.equal([]);
    });
    it('Should resolve to an array of cardpacks for users that have cardpacks', () => {
      return dbExports.getCardpacks(db.users[0].email)
      .then((cardpacks) => {
        expect(cardpacks).to.exist;
        expect(cardpacks.constructor).to.equal(Array);
        expect(cardpacks.length).to.equal(2);
        expect(cardpacks[0].name).to.equal('testcardpack');
        expect(cardpacks[1].name).to.equal('testcardpack');
        expect(cardpacks[0].owner_user_id).to.not.exist;
        expect(cardpacks[1].owner_user_id).to.not.exist;
        expect(cardpacks[0].owner).to.exist;
        expect(cardpacks[1].owner).to.exist;
        expect(cardpacks[0].owner.email).to.equal(db.users[0].email);
        expect(cardpacks[1].owner.email).to.equal(db.users[0].email);
      });
    });
  });

  describe('getCardpack()', () => {
    it('Should exist', () => {
      expect(dbExports.getCardpack).to.exist;
    });
    it('Should be a function', () => {
      expect(dbExports.getCardpack).to.be.a('function');
    });
    it('Should retrieve cardpack properly when using a valid cardpack ID', () => {
      return dbExports.getCardpack(2)
      .then((cardpack) => {
        expect(cardpack).to.exist;
        expect(cardpack.owner_user_id).to.not.exist;
        expect(cardpack.owner).to.exist;
      });
    });
    it('Should retrieve cardpack properly when using a valid cardpack ID', () => {
      return expect(dbExports.getCardpack(1234)).to.be.rejected;
    });
  });

  describe('deleteCardpack()', () => {
    it('Should exist', () => {
      expect(dbExports.deleteCardpack).to.exist;
    });
    it('Should be a function', () => {
      expect(dbExports.deleteCardpack).to.be.a('function');
    });
    it('Should reject when trying to delete a cardpack that exists but is owned by someone else', () => {
      return expect(dbExports.deleteCardpack(db.users[1].email, 1)).to.be.rejected;
    });
    it('Should reject when trying to delete a cardpack that does not exist', () => {
      return expect(dbExports.deleteCardpack(db.users[1].email, 999)).to.be.rejected;
    });
    it('Should resolve to true when trying to delete a cardpack that you own', () => {
      return expect(dbExports.deleteCardpack(db.users[0].email, 1)).to.eventually.equal(true);
    });
  });

  let cardId;
  let cardOwnerEmail = db.users[0].email;
  describe('createCard()', () => {
    let cardpackId;
    before(() => {
      return dbExports.createCardpack(cardOwnerEmail, 'Cardpack')
      .then((cardpack) => {
        cardpackId = cardpack.id;
      });
    });

    it('Should create a black card', () => {
      return dbExports.createCard(cardOwnerEmail, cardpackId, 'test card', 'black')
      .then((card) => {
        cardId = card.id;
        expect(card).to.exist;
        expect(card.createdAt).to.exist;
        expect(card.updatedAt).to.exist;
        expect(card.cardpack_id).to.not.exist;
        expect(card.cardpack).to.exist;
        expect(card.cardpack.id).to.equal(cardpackId);
        expect(card.text).to.equal('test card');
        expect(card.type).to.equal('black');
      });
    });
    it('Should create a white card', () => {
      return dbExports.createCard(cardOwnerEmail, cardpackId, 'test card 2', 'white')
      .then((card) => {
        expect(card).to.exist;
        expect(card.createdAt).to.exist;
        expect(card.updatedAt).to.exist;
        expect(card.cardpack_id).to.not.exist;
        expect(card.cardpack).to.exist;
        expect(card.cardpack.id).to.equal(cardpackId);
        expect(card.text).to.equal('test card 2');
        expect(card.type).to.equal('white');
      });
    });
    it('Should not create a card if the card type is invalid', () => {
      return expect(dbExports.createCard(cardOwnerEmail, cardpackId, 'test', 'invalidcardtype')).to.be.rejected;
    });
    it('Should not create a card if the card text is blank', () => {
      return expect(dbExports.createCard(cardOwnerEmail, cardpackId, '', 'white')).to.be.rejected;
    });
    it('Should not create a card if the cardpack ID doesn\'t map to an existing cardpack', () => {
      return expect(dbExports.createCard(cardOwnerEmail, cardpackId + 1, 'test', 'white')).to.be.rejected;
    });
    it('Should not create a card if the card creator is not the cardpack owner', () => {
      return expect(dbExports.createCard(db.users[1].email, cardpackId, 'test', 'white')).to.be.rejected;
    });
  });

  describe('updateCard()', () => {
    it('Should modify an existing card', () => {
      return dbExports.updateCard(cardOwnerEmail, cardId, 'updated card name')
      .then((card) => {
        expect(card).to.exist;
        expect(card.createdAt).to.exist;
        expect(card.updatedAt).to.exist;
        expect(card.id).to.equal(cardId);
        expect(card.text).to.equal('updated card name');
      });
    });
    it('Should modify a previously modified card', () => {
      return dbExports.updateCard(cardOwnerEmail, cardId, 'twice updated card name')
      .then((card) => {
        expect(card).to.exist;
        expect(card.createdAt).to.exist;
        expect(card.updatedAt).to.exist;
        expect(card.id).to.equal(cardId);
        expect(card.text).to.equal('twice updated card name');
      });
    });
    it('Should reject when modifying a card using an email that is not tied to a user', () => {
      return expect(dbExports.updateCard('thisisafake@email.com', cardId, 'thrice updated card name')).to.be.rejected;
    });
    it('Should reject when modifying a card that is not owned by the user modifying the card', () => {
      return expect(dbExports.updateCard(db.users[1].email, cardId, 'thrice updated card name')).to.be.rejected;
    });
    it('Should reject when passing in a card ID that does not map to an existing card', () => {
      return expect(dbExports.updateCard(cardOwnerEmail, 123456789, 'thrice updated card name')).to.be.rejectedWith('Card ID does not map to an existing card');
    });
    it('Should reject when changing card text to a blank string', () => {
      return expect(dbExports.updateCard(cardOwnerEmail, cardId, '')).to.be.rejectedWith('Card should be a non-empty string');
    });
  });

  describe('deleteCard()', () => {
    it('Should reject when deleting a card you do not own', () => {
      return expect(dbExports.deleteCard(db.users[1].email, cardId)).to.be.rejectedWith('User does not own this card');
    });
    it('Should reject when deleting a card that does not exist', () => {
      return expect(dbExports.deleteCard(cardOwnerEmail, 123456789)).to.be.rejectedWith('Card ID does not map to an existing card');
    });
    it('Should delete a card when all parameters are valid', () => {
      return dbExports.deleteCard(cardOwnerEmail, cardId)
      .then((deletedCard) => {
        expect(deletedCard).to.exist;
      });
    });
  });

  describe('getCards()', () => {
    before(() => {
      return dbExports.createCardpack(db.users[2].email, 'testcardpack')
      .then((cardpack) => {
        cardpackId = cardpack.id;
        return dbExports.createCard(db.users[2].email, cardpackId, 'testcard', 'white');
      })
      .then(() => {
        return dbExports.createCard(db.users[2].email, cardpackId, 'testcard2', 'black');
      });
    });

    it('Should get cards for a cardpack', () => {
      return dbExports.getCards(cardpackId)
      .then((cards) => {
        expect(cards.length).to.equal(2);
      });
    });
  });
});