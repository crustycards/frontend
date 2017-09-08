const chai = require('chai').use(require('chai-as-promised')).use(require('chai-http'));
const expect = chai.expect;
const app = require('../../server').listen(8080);
const db = require('../../database');
const request = chai.request(app);
const sinon = require('sinon');
const agent = chai.request.agent(app);
const agent2 = chai.request.agent(app);

describe('/api/games', () => {
  before(() => {
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

  describe('GET', () => {
    it('Should get all existing games', () => {
      return agent.post('/api/games')
        .send({gameName: 'test game'});
    });
  });
});