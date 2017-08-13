const Sequelize = require('sequelize');
const dbConfig = require('../database/config.js');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

let sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
let models = require('../database/models.js')(sequelize);
let dbExports = require('../database/index.js');
let db = require('./mockDB.json');

module.exports.run = () => {
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
          return expect(dbExports.getUser('thisisafakeemail')).to.be.rejected;
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
            expect(message.sender_id).to.equal(db.users[0].id);
            expect(message.receiver_id).to.equal(db.users[1].id);
            expect(message.id).to.exist;
            expect(message.text).to.equal(messageText);
          });
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
          expect(friendData.friends[0].id).to.equal(db.users[1].id);
          expect(friendData.friends[0].email).to.equal(db.users[1].email);
          expect(friendData.friends[0].firstname).to.equal(db.users[1].firstname);
          expect(friendData.friends[0].lastname).to.equal(db.users[1].lastname);
        });
      });
    });

    describe('removeFriend()', () => {
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
  });
};