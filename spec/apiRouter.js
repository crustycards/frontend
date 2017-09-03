const chai = require('chai').use(require('chai-as-promised')).use(require('chai-http'));
const expect = chai.expect;
const app = require('../server').listen(8080);
const db = require('../database');
const request = chai.request(app);
const sinon = require('sinon');
const agent = chai.request.agent(app);
const agent2 = chai.request.agent(app);

describe('API Router', () => {
  before(() => {
    return db.connection.clear()
      .then(() => {
        return agent2.post('/signup')
          .send({firstname: 'Test', lastname: 'Person', email: 'test@person.com', password: 'test'})
          .then((res) => {
            expect(res).to.have.cookie;
          });
      });
  });

  it('Should be able to create new local users', () => {
    return agent.post('/signup')
      .send({firstname: 'Hello', lastname: 'World', email: 'hello@world.com', password: 'test'})
      .then((res) => {
        expect(res).to.have.cookie;
      });
  });

  describe('/api/currentuser', () => {
    describe('GET', () => {
      it('Should return error when not logged in', (done) => {
        request.get('/api/currentuser')
          .end((err, res) => {
            expect(err).to.exist;
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
            expect(user.googleId).to.equal(null); // Since the user we created was not registered through Google OAuth
            expect(user.firstname).to.equal('Hello');
            expect(user.lastname).to.equal('World');
            expect(user.email).to.equal('hello@world.com');
            expect(user.themeId).to.exist;
            expect(Object.keys(user).length).to.equal(8); // All keys listed above that should exist
            done();
          });
      });
      it('Should set user theme to zero by default', (done) => {
        agent.get('/api/currentuser')
          .end((err, res) => {
            user = res.body;
            expect(user.themeId).to.equal(1);
            done();
          });
      });
    });
  });

  describe('/api/messages', () => {
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
  });

  describe('/api/friends', () => {
    it('Should return error when not logged in', (done) => {
      request.get('/api/friends')
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
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
    it('Should return error when not logged in', (done) => {
      request.get('/api/friends')
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should show correct sent friend requests', (done) => {
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
    it('Should show correct received friend requests', (done) => {
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
    it('Should succeed when accepting a received friend request', (done) => {
      agent2.post('/api/friends')
        .send({user: 'hello@world.com', type: 'accept'})
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.body).to.equal('success');
          done();
        });
    });
    it('Should show correct friends list', (done) => {
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
    it('Should error when attempting to unfriend a nonexistent user', (done) => {
      agent.delete('/api/friends')
        .send({user: 'fake@email.com'})
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should successfully unfriend existing friends', (done) => {
      agent.delete('/api/friends')
        .send({user: 'test@person.com'})
        .end((err, res) => {
          expect(err).to.not.exist;
          // TODO - Break this file into many based on the API endpoints
          done();
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

  describe('/api/cardpacks', () => {
    it('Should create cardpacks when logged in', (done) => {
      agent.post('/api/cardpacks')
        .send({name: 'test cardpack'})
        .end((err, res) => {
          expect(err).to.not.exist;
          let cardpack = res.body;
          expect(cardpack).to.equal('success');
          done();
        });
    });
    it('Should return error when not logged in', (done) => {
      request.post('/api/cardpacks')
        .send({name: 'test cardpack'})
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should get cardpacks of current user when performing a GET with no user specified', (done) => {
      agent.get('/api/cardpacks')
        .end((err, res) => {
          expect(err).to.not.exist;
          let cardpacks = res.body;
          expect(cardpacks).to.be.a('array');
          expect(cardpacks.length).to.equal(1);
          done();
        });
    });
    it('Should get cardpacks of specific user when performing a GET with a particular user specified', (done) => {
      agent2.get('/api/cardpacks/user/' + 'hello@world.com')
        .end((err, res) => {
          expect(err).to.not.exist;
          let cardpacks = res.body;
          expect(cardpacks).to.be.a('array');
          expect(cardpacks.length).to.equal(1);
          expect(cardpacks[0].id).to.exist;
          done();
        });
    });
    it('Should return an error when retrieving cardpacks for a user that does not exist', (done) => {
      agent.get('/api/cardpacks/user/' + 'fake@email.com')
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });

    it('Should get cardpack by ID when performing a GET with a particular cardpack ID specified', (done) => {
      agent2.get('/api/cardpacks/' + 1)
        .end((err, res) => {
          expect(err).to.not.exist;
          let cardpack = res.body;
          expect(cardpack).to.be.a('object');
          expect(cardpack.name).to.equal('test cardpack');
          done();
        });
    });
    it('Should return an error when retrieving a cardpack by an ID that does not map to an existing cardpack', (done) => {
      agent.get('/api/cardpacks/' + 123456789)
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });

    let cardpackId = 1; // Since we've only created one cardpack

    it('Should return error when attempting to delete a cardpack that you do not own', (done) => {
      agent2.delete('/api/cardpacks')
        .send({id: cardpackId})
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should succeed when deleting a cardpack that you own', (done) => {
      agent.delete('/api/cardpacks')
        .send({id: cardpackId})
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.body).to.equal('success');
          done();
        });
    });
  });

  describe('/api/cards', () => {
    before((done) => {
      agent.post('/api/cardpacks')
        .send({name: 'test cardpack'})
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.body).to.equal('success');
          done();
        });
    });

    let cardpackId = 2;
    describe('POST', () => {
      it('Should be able to add cards to existing cardpacks', (done) => {
        agent.post('/api/cards/' + cardpackId)
          .send([{
            text: 'testcard',
            type: 'white'
          }])
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.body).to.equal('success');
            done();
          });
      });
      it('Should return error when adding cards to cardpack owned by another user', (done) => {
        agent2.post('/api/cards/' + cardpackId)
          .send([{
            text: 'testcard',
            type: 'white'
          }])
          .end((err, res) => {
            expect(err).to.exist;
            done();
          });
      });
      it('Should return error when adding cards to cardpack that does not exist', (done) => {
        agent.post('/api/cards/' + 123456789)
          .send([{
            text: 'testcard',
            type: 'white'
          }])
          .end((err, res) => {
            expect(err).to.exist;
            done();
          });
      });
      it('Should return error when adding cards using no cardpack ID in the url', (done) => {
        agent.post('/api/cards')
          .send([{
            text: 'testcard',
            type: 'white'
          }])
          .end((err, res) => {
            expect(err).to.exist;
            done();
          });
      });
      it('Should return error when adding a card with an invalid card type', (done) => {
        agent.post('/api/cards/' + cardpackId)
          .send([{
            text: 'testcard',
            type: 'asdf'
          }])
          .end((err, res) => {
            expect(err).to.exist;
            done();
          });
      });
    });
    it('Should succeed when setting answerFields for a new black card', (done) => {
      agent.post('/api/cards/' + cardpackId)
        .send([{
          text: 'testcard',
          type: 'black',
          answerFields: 3
        }])
        .end((err, res) => {
          expect(err).to.not.exist;
          done();
        });
    });
    it('Should return error when setting answerFields to a value greater than three when creating a card', (done) => {
      agent.post('/api/cards/' + cardpackId)
        .send([{
          text: 'testcard',
          type: 'black',
          answerFields: 4
        }])
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });

    describe('GET', () => {
      it('Should retrieve cards from a cardpack when logged in as the cardpack owner', (done) => {
        agent.get('/api/cards/' + cardpackId)
          .end((err, res) => {
            expect(err).to.not.exist;
            let cards = res.body;
            expect(cards).to.be.a('array');
            expect(cards.length).to.equal(2); // Since we only added two card in the previous tests
            expect(cards[0].text).to.equal('testcard');
            done();
          });
      });
      it('Should retrieve cards from a cardpack when not logged in', (done) => {
        request.get('/api/cards/' + cardpackId)
          .end((err, res) => {
            expect(err).to.not.exist;
            let cards = res.body;
            expect(cards).to.be.a('array');
            expect(cards.length).to.equal(2); // Since we only added one card in the previous tests
            expect(cards[0].text).to.equal('testcard');
            done();
          });
      });
      it('Should return error when retrieving cards with no card ID in the url', (done) => {
        request.get('/api/cards')
          .end((err, res) => {
            expect(err).to.exist;
            done();
          });
      });
    });

    describe('DELETE', () => {
      let cardId = 1;

      it('Should not be able to delete cards when not logged in', (done) => {
        request.delete('/api/cards/' + cardId)
          .end((err, res) => {
            expect(err).to.exist;
            done();
          });
      });
      it('Should not be able to delete cards from another user\'s cardpack', (done) => {
        agent2.delete('/api/cards/' + cardId)
          .end((err, res) => {
            expect(err).to.exist;
            done();
          });
      });
      it('Should be able to delete cards when logged in', (done) => {
        agent.delete('/api/cards/' + cardId)
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.body).to.equal('success');
            done();
          });
      });
    });
  });
});