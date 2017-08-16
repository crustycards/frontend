const expect = require('chai').use(require('chai-as-promised')).expect;
const Game = require('../game/Game.js');
const Users = require('../game/users.js');

module.exports.run = () => {
  describe('Users', () => {
    let users;
    beforeEach(() => {
      users = new Users();
    });

    it('Should increment number of users when adding a user', () => {
      expect(users.size).to.equal(0);
      users.addUser({email: 'test@gmail.com'});
      expect(users.size).to.equal(1);
    });
    it('Should keep track of users in hash table', () => {
      users.addUser({email: 'test@gmail.com'});
      expect(users.userTable['test@gmail.com']).to.exist;
    });
    it('Should not increment number of users when adding a user that is already in the game', () => {
      expect(users.size).to.equal(0);
      users.addUser({email: 'test@gmail.com'});
      expect(users.size).to.equal(1);
      users.addUser({email: 'test@gmail.com'});
      expect(users.size).to.equal(1);
    });
    it('Should set judge and owner when adding first user', () => {
      users.addUser({email: 'test@gmail.com'});
      expect(users.owner.email).to.equal('test@gmail.com');
      expect(users.judge.email).to.equal('test@gmail.com');
      users.addUser({email: 'hello@world.com'});
      expect(users.owner.email).to.equal('test@gmail.com');
      expect(users.judge.email).to.equal('test@gmail.com');
    });
    it('Should remove users', () => {
      users.addUser({email: 'test@gmail.com'});
      users.removeUser({email: 'test@gmail.com'});
      expect(users.size).to.equal(0);
      expect(users.userTable['test@gmail.com']).to.not.exist;
    });
    it('Should change judge to next player when removing the user that is the judge', () => {
      users.addUser({email: 'test@gmail.com'});
      expect(users.owner.email).to.equal('test@gmail.com');
      users.addUser({email: 'hello@world.com'});
      expect(users.owner.email).to.equal('test@gmail.com');
    });
    it('Should cycle judges correctly', () => {
      users.addUser({email: 'test@gmail.com'});
      users.addUser({email: 'test2@gmail.com'});
      users.addUser({email: 'test3@gmail.com'});
      users.addUser({email: 'test4@gmail.com'});
      expect(users.judge.email).to.equal('test@gmail.com');
      users.cycleJudge();
      expect(users.judge.email).to.equal('test2@gmail.com');
      users.cycleJudge();
      expect(users.judge.email).to.equal('test3@gmail.com');
      users.cycleJudge();
      expect(users.judge.email).to.equal('test4@gmail.com');
      users.cycleJudge();
      expect(users.judge.email).to.equal('test@gmail.com');
    });
    it('Should reassign owner if current owner leaves', () => {
      users.addUser({email: 'test@gmail.com'});
      users.addUser({email: 'test2@gmail.com'});
      users.removeUser({email: 'test@gmail.com'});
      expect(users.owner.email).to.equal('test2@gmail.com');
    });
    it('Should reassign judge if current judge leaves', () => {
      users.addUser({email: 'test@gmail.com'});
      users.addUser({email: 'test2@gmail.com'});
      users.removeUser({email: 'test@gmail.com'});
      expect(users.judge.email).to.equal('test2@gmail.com');
    });
  });
};