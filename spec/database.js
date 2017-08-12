const Sequelize = require('sequelize');
const dbConfig = require('../database/config.js');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

let sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
let models = require('../database/models.js')(sequelize);
let helpers = require('../database/helpers.js');
let exportFuncs = require('../database/index.js');

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

    describe('Helpers', () => {
      describe('addFriend()', () => {
        it('Should exist', () => {
          expect(helpers.addFriend).to.exist;
        });
        it('Should be a function', () => {
          expect(helpers.addFriend).to.be.a('function');
        });
      });
    });

    describe('Export Functions', () => {
      describe('getUserByEmail()', () => {
        it('Should exist', () => {
          expect(exportFuncs.getUser).to.exist;
        });
        it('Should be a function', () => {
          expect(exportFuncs.getUser).to.be.a('function');
        });
        it('Should retrieve a user if they exist', () => {
          let promise = exportFuncs.getUser(db.users[0].email)
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
          return expect(exportFuncs.getUser('thisisafakeemail')).to.be.rejected;
        });
      });

      describe('addMessage()', () => {
        it('Should exist', () => {
          expect(exportFuncs.addMessage).to.exist;
        });
        it('Should be a function', () => {
          expect(exportFuncs.addMessage).to.be.a('function');
        });
        it('Should add messages', () => {
          let messageText = 'thisisamessage';
          return exportFuncs.addMessage(db.users[0].email, db.users[1].email, messageText)
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
          expect(exportFuncs.getMessages).to.exist;
        });
        it('Should be a function', () => {
          expect(exportFuncs.getMessages).to.be.a('function');
        });
        it('Should retrieve messages between users', () => {
          return exportFuncs.getMessages(db.users[0].email, db.users[1].email)
          .then((messages) => {
            expect(messages.length).to.equal(db.messages.length + 1); // +1 because of the addMessage() tests adding a message
            for (let i = 0; i < db.messages.length; i++) {
              expect(messages[i].text).to.exist;
              expect(messages[i].sender_id).to.exist;
              expect(messages[i].receiver_id).to.exist;
              expect(messages[i].text).to.equal(db.messages[i].text);
              expect(messages[i].sender_id).to.equal(db.messages[i].sender_id);
              expect(messages[i].receiver_id).to.equal(db.messages[i].receiver_id);
            }
          });
        });
      });
    });
  });
};