const expect = require('chai').use(require('chai-as-promised')).expect;
const User = require('../../database/models/user');
const mockDB = require('./mockDB.json');

describe('User', () => {
  it('Should exist', () => {
    expect(User.model).to.exist;
  });
});