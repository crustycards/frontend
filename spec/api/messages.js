const chai = require('chai').use(require('chai-as-promised')).use(require('chai-http'));
const expect = chai.expect;
const app = require('../../server').listen(8080);
const db = require('../../database');
const request = chai.request(app);
const sinon = require('sinon');
const agent = chai.request.agent(app);
const agent2 = chai.request.agent(app);

describe('/api/messages', () => {
  beforeEach(() => {
    return db.connection.clear()
      .then(() => {
        return agent.post('/signup')
          .send({name: 'Hello World', email: 'hello@world.com', password: 'test'});
      })
      .then(() => {
        return agent2.post('/signup')
          .send({name: 'Hello World', email: 'test@person.com', password: 'test'});
      });
  });
  describe('GET', () => {
    it('Should get messages', (done) => {
      agent.post('/api/messages')
        .send({user: 'test@person.com', text: 'hello there'})
        .then(() => {
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
    });
    it('Should return error when not logged in', (done) => {
      request.get('/api/messages')
        .end((err, res) => {
          expect(err).to.exist;
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

  describe('POST', () => {
    it('Should return error when not logged in', (done) => {
      request.post('/api/messages')
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should successfully create message when logged in and sending to valid user', (done) => {
      agent.post('/api/messages')
        .send({user: 'test@person.com', text: 'hello there'})
        .end((err, res) => {
          expect(err).to.not.exist;
          let message = res.body;
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
});