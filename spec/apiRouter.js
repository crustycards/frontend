const chai = require('chai').use(require('chai-as-promised')).use(require('chai-http'));
const expect = chai.expect;
const app = require('../server').listen(8080);
const request = chai.request(app);
const sinon = require('sinon');
const agent = chai.request.agent(app);

module.exports.run = () => {
  describe('API Router', () => {
    it('Should be able to create new local users', () => {
      agent.post('/signup')
      .send({firstname: 'Hello', lastname: 'World', email: 'hello@world.com', password: 'test'})
      .then((res) => {
        expect(res).to.have.cookie('sessionid');
      });
    });

    describe('/api/currentuser', () => {
      it('Should redirect to login page when not logged in', (done) => {
        request.get('/api/currentuser')
        .end((err, res) => {
          // expect(res).to.be.json;
          expect(res).to.redirectTo('http://127.0.0.1:8080/login');
          done();
        });
      });
      it('Should return current user when logged in', (done) => {
        agent.get('/api/currentuser')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.not.redirect;
          expect(res.body).to.be.a('object');
          console.log(res.body);
          expect(res).to.be.json;
          let user = res.body;
          expect(user.id).to.exist;
          expect(user.createdAt).to.exist;
          expect(user.updatedAt).to.exist;
          expect(user.password).to.not.exist;
          expect(user.google_id).to.equal(null); // Since the user we created was not registered through Google OAuth
          expect(user.firstname).to.equal('Hello');
          expect(user.lastname).to.equal('World');
          expect(user.email).to.equal('hello@world.com');
          expect(Object.keys(user).length).to.equal(7); // All keys listed above that should exist
          done();
        });
      });
    });
  });
};