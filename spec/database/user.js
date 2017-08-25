const expect = require('chai').use(require('chai-as-promised')).expect;
const {User, connection} = require('../../database');
const mockDB = require('./mockDB.json');
const mockDBHelpers = require('./mockDBHelpers');

describe('User', () => {
  beforeEach(() => {
    return connection.clear()
      .then(() => {
        return mockDBHelpers.createUsers();
      });
  });

  it('Should exist', () => {
    expect(User.model).to.exist;
  });
  describe('getByEmail', () => {
    it('Should exist', () => {
      expect(User.getByEmail).to.exist;
    });
    it('Should be a function', () => {
      expect(User.getByEmail).to.be.a('function');
    });
    it('Should retrieve a user if they exist', () => {
      let promise = User.getByEmail(mockDB.users[0].email)
        .then((user) => {
          expect(user.createdAt).to.exist;
          expect(user.updatedAt).to.exist;
          expect(user.password).to.not.exist;
          delete user.createdAt;
          delete user.updatedAt;
          return user;
        });
      return expect(promise).to.eventually.deep.equal(mockDB.users[0]);
    });
    it('Should reject if a user does not exist', () => {
      let fakeEmail = 'thisisafakeemail';
      return expect(User.getByEmail(fakeEmail)).to.be.rejectedWith('No user is registered under ' + fakeEmail);
    });
  });
  describe('getById()', () => {
    it('Should exist', () => {
      expect(User.getById).to.exist;
    });
    it('Should be a function', () => {
      expect(User.getById).to.be.a('function');
    });
    it('Should get a user by their ID', () => {
      let promise = User.getById(mockDB.users[2].id)
      .then((user) => {
        expect(user.createdAt).to.exist;
        expect(user.updatedAt).to.exist;
        expect(user.password).to.not.exist;
        delete user.createdAt;
        delete user.updatedAt;
        return user;
      });
      return expect(promise).to.eventually.deep.equal(mockDB.users[2]);
    });
    it('Should throw an error when passed in an invalid ID', () => {
      let ID = -1;
      return expect(User.getById(ID)).to.be.rejectedWith('No user has ID ' + ID);
    });
    it('Should throw an error when passed in a non-number', () => {
      let ID = 'cat';
      return expect(User.getById(ID)).to.be.rejectedWith('No user has ID ' + ID);
    });
  });
});