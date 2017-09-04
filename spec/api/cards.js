const chai = require('chai').use(require('chai-as-promised')).use(require('chai-http'));
const expect = chai.expect;
const app = require('../../server').listen(8080);
const db = require('../../database');
const request = chai.request(app);
const sinon = require('sinon');
const agent = chai.request.agent(app);
const agent2 = chai.request.agent(app);

describe('/api/cards', () => {
  beforeEach(() => {
    return db.connection.clear()
      .then(() => {
        return agent.post('/signup')
          .send({firstname: 'Hello', lastname: 'World', email: 'hello@world.com', password: 'test'});
      })
      .then(() => {
        return agent2.post('/signup')
          .send({firstname: 'Test', lastname: 'Person', email: 'test@person.com', password: 'test'});
      });
  });

  describe('POST', () => {
    it('Should be able to add cards to existing cardpacks', (done) => {
      agent.post('/api/cardpacks')
        .send({name: 'test cardpack'})
        .then(() => {
          agent.post('/api/cards/' + 1)
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
    });
    it('Should return error when adding more than 100 cards in one request', (done) => {
      let cards = [];
      for (let i = 0; i < 101; i++) {
        cards.push({text: 'card' + i, type: 'white'});
      }
      agent.post('/api/cardpacks')
        .send({name: 'test cardpack'})
        .then(() => {
          agent.post('/api/cards/' + 1)
            .send(cards)
            .end((err, res) => {
              expect(err).to.exist;
              done();
            });
        });
    });
    it('Should return error when adding cards to cardpack owned by another user', (done) => {
      agent.post('/api/cardpacks')
        .send({name: 'test cardpack'})
        .then(() => {
          agent2.post('/api/cards/' + 1)
            .send([{
              text: 'testcard',
              type: 'white'
            }])
            .end((err, res) => {
              expect(err).to.exist;
              done();
            });
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
      agent.post('/api/cardpacks')
        .send({name: 'test cardpack'})
        .then(() => {
          agent.post('/api/cards/' + 1)
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
  });
  it('Should succeed when setting answerFields for a new black card', (done) => {
    agent.post('/api/cardpacks')
      .send({name: 'test cardpack'})
      .then(() => {
        agent.post('/api/cards/' + 1)
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
  });
  it('Should return error when setting answerFields to a value greater than three when creating a card', (done) => {
    agent.post('/api/cardpacks')
      .send({name: 'test cardpack'})
      .then(() => {
        agent.post('/api/cards/' + 1)
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
  });

  describe('GET', () => {
    it('Should retrieve cards from a cardpack when logged in as the cardpack owner', (done) => {
      agent.post('/api/cardpacks')
        .send({name: 'test cardpack'})
        .then(() => {
          return agent.post('/api/cards/' + 1)
            .send([{
              text: 'testcard',
              type: 'black',
              answerFields: 3
            }]);
        })
        .then(() => {
          agent.get('/api/cards/' + 1)
            .end((err, res) => {
              expect(err).to.not.exist;
              let cards = res.body;
              expect(cards).to.be.a('array');
              expect(cards.length).to.equal(1);
              expect(cards[0].text).to.equal('testcard');
              done();
            });
        });
    });
    it('Should retrieve cards from a cardpack when not logged in', (done) => {
      agent.post('/api/cardpacks')
        .send({name: 'test cardpack'})
        .then(() => {
          return agent.post('/api/cards/' + 1)
            .send([{
              text: 'testcard',
              type: 'black',
              answerFields: 3
            }]);
        })
        .then(() => {
          request.get('/api/cards/' + 1)
            .end((err, res) => {
              expect(err).to.not.exist;
              let cards = res.body;
              expect(cards).to.be.a('array');
              expect(cards.length).to.equal(1);
              expect(cards[0].text).to.equal('testcard');
              done();
            });
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
      agent.post('/api/cardpacks')
        .send({name: 'test cardpack'})
        .then(() => {
          return agent.post('/api/cards/' + 1)
            .send([{
              text: 'testcard',
              type: 'black',
              answerFields: 3
            }]);
        })
        .then(() => {
          request.delete('/api/cards/' + cardId)
            .end((err, res) => {
              expect(err).to.exist;
              done();
            });
        });
    });
    it('Should not be able to delete cards from another user\'s cardpack', (done) => {
      agent.post('/api/cardpacks')
        .send({name: 'test cardpack'})
        .then(() => {
          return agent.post('/api/cards/' + 1)
            .send([{
              text: 'testcard',
              type: 'black',
              answerFields: 3
            }]);
        })
        .then(() => {
          agent2.delete('/api/cards/' + cardId)
            .end((err, res) => {
              expect(err).to.exist;
              done();
            });
        });
    });
    it('Should be able to delete cards when logged in', (done) => {
      agent.post('/api/cardpacks')
        .send({name: 'test cardpack'})
        .then(() => {
          return agent.post('/api/cards/' + 1)
            .send([{
              text: 'testcard',
              type: 'black',
              answerFields: 3
            }]);
        })
        .then(() => {
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