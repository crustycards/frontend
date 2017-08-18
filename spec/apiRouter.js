const chai = require('chai').use(require('chai-as-promised')).use(require('chai-http'));
const expect = chai.expect;
const app = require('../server').listen(8080);
const request = chai.request(app);
const sinon = require('sinon');
const agent = chai.request.agent(app);
const agent2 = chai.request.agent(app);

module.exports.run = () => {
  describe('API Router', () => {
    before(() => {
      agent2.post('/signup')
      .send({firstname: 'Test', lastname: 'Person', email: 'test@person.com', password: 'test'})
      .then((res) => {
        expect(res).to.have.cookie('sessionid');
      });
    });

    it('Should be able to create new local users', () => {
      agent.post('/signup')
      .send({firstname: 'Hello', lastname: 'World', email: 'hello@world.com', password: 'test'})
      .then((res) => {
        expect(res).to.have.cookie('sessionid');
      });
    });

    describe('/api/currentuser', () => {
      describe('GET', () => {
        it('Should redirect to login page when not logged in', (done) => {
          request.get('/api/currentuser')
          .end((err, res) => {
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

    describe('/api/messages', () => {
      describe('POST', () => {
        it('Should redirect to login page when not logged in', (done) => {
          request.post('/api/messages')
          .end((err, res) => {
            expect(res).to.redirectTo('http://127.0.0.1:8080/login');
            done();
          });
        });
        it('Should successfully create message when logged in and sending to valid user', (done) => {
          agent.post('/api/messages')
          .send({user: 'test@person.com', text: 'hello there'})
          .end((err, res) => {
            expect(err).to.not.exist;
            let message = res.body
            expect(message).to.be.a('object');
            expect(message.id).to.exist;
            expect(message.sender).to.exist;
            expect(message.receiver).to.exist;
            expect(message.createdAt).to.exist;
            expect(message.updatedAt).to.exist;
            expect(message.text).to.equal('hello there');
            expect(Object.keys(message).length).to.equal(6);
            done();
          });
        });
        it('Should return an error when sending a message to a nonexistent user', (done) => {
          agent.post('/api/messages')
          .send({user: 'fake@email.com', text: 'hello there'})
          .end((err, res) => {
            expect(err).to.exist;
            done();
          });
        });
        it('Should return an error when sending a blank message to an existing user', (done) => {
          agent.post('/api/messages')
          .send({user: 'test@person.com', text: ''})
          .end((err, res) => {
            expect(err).to.exist;
            done();
          });
        });
      });

      describe('GET', () => {
        it('Should get messages', (done) => {
          agent2.get('/api/messages')
          .send({user: 'hello@world.com'})
          .end((err, res) => {
            let messages = res.body;
            expect(messages).to.exist;
            expect(messages).to.be.a('array');
            expect(messages.length).to.equal(1);
            expect(messages[0].text).to.equal('hello there');
            done();
          });
        });
        it('Should redirect to login page when not logged in', (done) => {
          request.get('/api/messages')
          .end((err, res) => {
            expect(res).to.redirectTo('http://127.0.0.1:8080/login');
            done();
          });
        });
        it('Should return error when retrieving messages with a fake user', (done) => {
          agent2.get('/api/messages')
          .send({user: 'fake@email.com'})
          .end((err, res) => {
            expect(err).to.exist;
            done();
          });
        });
      });
    });
  });
};