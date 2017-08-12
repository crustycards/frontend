let sinon = require('sinon');
let path = require('path');
let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

let models = require('../database/models.js');
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
      return models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
      .then(() => {
        return models.sequelize.sync({force: true});
      })
      .then(() => {
        return models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      })
      .then(() => {
        return models.sequelize.sync();
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

      describe('getMessages()', () => {
        //
      });
    });
  });
};