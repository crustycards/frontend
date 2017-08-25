const expect = require('chai').use(require('chai-as-promised')).expect;
const {Cardpack, connection} = require('../../database');
const mockDB = require('./mockDB.json');
const mockDBHelpers = require('./mockDBHelpers');

describe('Cardpack', () => {
  beforeEach(() => {
    return connection.clear()
      .then(() => {
        return mockDBHelpers.createUsers();
      });
  });

  it('Should exist', () => {
    expect(Cardpack.model).to.exist;
  });
  describe('create()', () => {
    it('Should exist', () => {
      expect(Cardpack.create).to.exist;
    });
    it('Should be a function', () => {
      expect(Cardpack.create).to.be.a('function');
    });
    it('Should create a cardpack when given an existing user', () => {
      let ownerEmail = mockDB.users[0].email;
      let cardpackName = mockDB.cardpacks[0].name;
      return Cardpack.create(ownerEmail, cardpackName)
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
    it('Should allow creating multiple cardpacks with the same name', (done) => {
      let ownerEmail = mockDB.users[0].email;
      let cardpackOneName = mockDB.cardpacks[0].name;
      let cardpackTwoName = mockDB.cardpacks[1].name;
      Cardpack.create(ownerEmail, cardpackOneName)
        .then((cardpackOne) => {
          return Cardpack.create(ownerEmail, cardpackTwoName)
            .then((cardpackTwo) => {
              expect(cardpackOne).to.exist;
              expect(cardpackTwo).to.exist;
              expect(cardpackOne.id).to.not.equal(cardpackTwo.id);
              done();
            });
        });
    });
    it('Should not create a cardpack when given a non-existing user', () => {
      let cardpackName = mockDB.cardpacks[0].name;
      let ownerEmail = 'notarealemail@fakesite.com';
      return expect(Cardpack.create(ownerEmail, cardpackName)).to.be.rejectedWith('No user is registered under ' + ownerEmail);
    });
    it('Should not create a cardpack when given an empty string as a cardpack name', () => {
      let cardpackName = '';
      let ownerEmail = mockDB.users[1].email;
      return expect(Cardpack.create(ownerEmail, cardpackName)).to.be.rejectedWith('Cardpack name is invalid - name must be a non-empty string');
    });
  });

  describe('getByUserEmail()', () => {
    it('Should exist', () => {
      expect(Cardpack.getByUserEmail).to.exist;
    });
    it('Should be a function', () => {
      expect(Cardpack.getByUserEmail).to.be.a('function');
    });
    it('Should resolve to empty array for user that has no cardpacks', () => {
      return expect(Cardpack.getByUserEmail(mockDB.users[3].email)).to.eventually.deep.equal([]);
    });
    it('Should resolve to an array of cardpacks for users that have cardpacks', () => {
      let ownerEmail = mockDB.users[0].email;
      let cardpackOneName = mockDB.cardpacks[0].name;
      let cardpackTwoName = mockDB.cardpacks[1].name;
      return Cardpack.create(ownerEmail, cardpackOneName)
        .then(() => {
          return Cardpack.create(ownerEmail, cardpackTwoName)
        })
        .then(() => {
          return Cardpack.getByUserEmail(ownerEmail)
            .then((cardpacks) => {
              expect(cardpacks).to.exist;
              expect(cardpacks.constructor).to.equal(Array);
              expect(cardpacks.length).to.equal(2);
              expect(cardpacks[0].name).to.equal(cardpackOneName);
              expect(cardpacks[1].name).to.equal(cardpackTwoName);
              expect(cardpacks[0].ownerId).to.not.exist;
              expect(cardpacks[1].ownerId).to.not.exist;
              expect(cardpacks[0].owner).to.exist;
              expect(cardpacks[1].owner).to.exist;
              expect(cardpacks[0].owner.email).to.equal(ownerEmail);
              expect(cardpacks[1].owner.email).to.equal(ownerEmail);
            });
        });
    });
  });

  describe('getById()', () => {
    it('Should exist', () => {
      expect(Cardpack.getById).to.exist;
    });
    it('Should be a function', () => {
      expect(Cardpack.getById).to.be.a('function');
    });
    it('Should retrieve cardpack properly when using a valid cardpack ID', () => {
      let ownerEmail = mockDB.users[0].email;
      let cardpackOneName = mockDB.cardpacks[0].name;
      let cardpackTwoName = mockDB.cardpacks[1].name;
      return Cardpack.create(ownerEmail, cardpackOneName)
        .then(() => {
          return Cardpack.create(ownerEmail, cardpackTwoName)
        })
        .then(() => {
          return Cardpack.getById(2)
            .then((cardpack) => {
              expect(cardpack).to.exist;
              expect(cardpack.name).to.equal(cardpackTwoName);
              expect(cardpack.ownerId).to.not.exist;
              expect(cardpack.owner).to.exist;
              expect(cardpack.owner.email).to.equal(ownerEmail);
            });
        });
    });
    it('Should reject when trying to retrieve a cardpack that does not exist', () => {
      return expect(Cardpack.getById(-1)).to.be.rejectedWith('Cardpack ID does not map to an existing cardpack');
    });
  });

  describe('delete()', () => {
    it('Should exist', () => {
      expect(Cardpack.delete).to.exist;
    });
    it('Should be a function', () => {
      expect(Cardpack.delete).to.be.a('function');
    });
    it('Should reject when trying to delete a cardpack that exists but is owned by someone else', () => {
      let ownerEmail = mockDB.users[0].email;
      let otherEmail = mockDB.users[1].email;
      let cardpackName = mockDB.cardpacks[0].name;
      return Cardpack.create(ownerEmail, cardpackName)
        .then((cardpack) => {
          return expect(Cardpack.delete(otherEmail, cardpack.id)).to.be.rejectedWith('Cannot delete someone else\'s cardpack');
        });
    });
    it('Should reject when trying to delete a cardpack that does not exist', () => {
      return expect(Cardpack.delete(mockDB.users[1].email, -1)).to.be.rejectedWith('Cardpack does not exist');
    });
    it('Should resolve to true when trying to delete a cardpack that you own', () => {
      let ownerEmail = mockDB.users[0].email;
      let cardpackName = mockDB.cardpacks[0].name;
      return Cardpack.create(ownerEmail, cardpackName)
        .then((cardpack) => {
          return expect(Cardpack.delete(ownerEmail, cardpack.id)).to.eventually.equal(true);
        });
    });
  });
});