const chai = require('chai').use(require('chai-as-promised')).use(require('chai-http'));
const expect = chai.expect;
const app = require('../../server').listen(8080);
const db = require('../../database');
const request = chai.request(app);
const sinon = require('sinon');
const agent = chai.request.agent(app);
const agent2 = chai.request.agent(app);

describe('/api/friends', () => {
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
    it('Should return error when not logged in', (done) => {
      request.get('/api/friends')
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should show correct sent friend requests', (done) => {
      agent.post('/api/friends')
        .send({user: 'test@person.com', type: 'request'})
        .then(() => {
          agent.get('/api/friends')
            .end((err, res) => {
              expect(err).to.not.exist;
              expect(res.body.requestsSent).to.be.a('array');
              expect(res.body.requestsSent.length).to.equal(1);
              expect(res.body.requestsSent[0].email).to.equal('test@person.com');
              expect(res.body.requestsReceived).to.be.a('array');
              expect(res.body.requestsReceived.length).to.equal(0);
              expect(res.body.friends).to.be.a('array');
              expect(res.body.friends.length).to.equal(0);
              done();
            });
        });
    });
    it('Should show correct received friend requests', (done) => {
      agent.post('/api/friends')
        .send({user: 'test@person.com', type: 'request'})
        .then(() => {
          agent2.get('/api/friends')
            .end((err, res) => {
              expect(err).to.not.exist;
              expect(res.body.requestsSent).to.be.a('array');
              expect(res.body.requestsSent.length).to.equal(0);
              expect(res.body.requestsReceived).to.be.a('array');
              expect(res.body.requestsReceived.length).to.equal(1);
              expect(res.body.requestsReceived[0].email).to.equal('hello@world.com');
              expect(res.body.friends).to.be.a('array');
              expect(res.body.friends.length).to.equal(0);
              done();
            });
        });
    });
    it('Should show correct friends list', (done) => {
      agent.post('/api/friends')
        .send({user: 'test@person.com', type: 'request'})
        .then(() => {
          return agent2.post('/api/friends')
            .send({user: 'hello@world.com', type: 'accept'});
        })
        .then(() => {
          agent.get('/api/friends')
            .end((err, res) => {
              expect(err).to.not.exist;
              expect(res.body.requestsSent).to.be.a('array');
              expect(res.body.requestsSent.length).to.equal(0);
              expect(res.body.requestsReceived).to.be.a('array');
              expect(res.body.requestsReceived.length).to.equal(0);
              expect(res.body.friends).to.be.a('array');
              expect(res.body.friends.length).to.equal(1);
              expect(res.body.friends[0].email).to.equal('test@person.com');
              done();
            });
        });
    });
  });

  describe('POST', () => {
    it('Should error when sending a friend request to a nonexistent user', (done) => {
      agent.post('/api/friends')
        .send({user: 'fake@email.com', type: 'request'})
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should error when accepting a request from a nonexistent user', (done) => {
      agent.post('/api/friends')
        .send({user: 'fake@email.com', type: 'accept'})
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should error when sending post that is neither a request nor an accept', (done) => {
      agent.post('/api/friends')
        .send({user: 'test@person.com', type: 'invalidparameter'})
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should error when accepting a request from an existing user that did not send a request', (done) => {
      agent.post('/api/friends')
        .send({user: 'test@person.com', type: 'accept'})
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should error when accepting to friend yourself', (done) => {
      agent.post('/api/friends')
        .send({user: 'hello@world.com', type: 'request'})
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should send a friend request between users that have no current friendship or friend request open', (done) => {
      agent.post('/api/friends')
        .send({user: 'test@person.com', type: 'request'})
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.body).to.equal('success');
          done();
        });
    });
    it('Should error when attempting to accept a request that you sent', (done) => {
      agent.post('/api/friends')
        .send({user: 'test@person.com', type: 'accept'})
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should succeed when accepting a received friend request', (done) => {
      agent.post('/api/friends')
      .send({user: 'test@person.com', type: 'request'})
      .then(() => {
        agent2.post('/api/friends')
          .send({user: 'hello@world.com', type: 'accept'})
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.body).to.equal('success');
            done();
          });
      });
    });
  });

  describe('DELETE', () => {
    it('Should error when attempting to unfriend a nonexistent user', (done) => {
      agent.delete('/api/friends')
        .send({user: 'fake@email.com'})
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should successfully unfriend existing friends', (done) => {
      agent.post('/api/friends')
        .send({user: 'test@person.com', type: 'request'})
        .then(() => {
          return agent2.post('/api/friends')
            .send({user: 'hello@world.com', type: 'accept'});
        })
        .then(() => {
          agent.delete('/api/friends')
            .send({user: 'test@person.com'})
            .end((err, res) => {
              expect(err).to.not.exist;
              done();
            });
        });
    });
    it('Should error when attempting to unfriend existing users that are not friends', (done) => {
      agent.delete('/api/friends')
        .send({user: 'test@person.com'})
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
  });
});