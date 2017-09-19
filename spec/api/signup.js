const chai = require('chai').use(require('chai-as-promised')).use(require('chai-http'));
const expect = chai.expect;
const app = require('../../server').listen(8080);
const db = require('../../database');
const request = chai.request(app);
const agent = chai.request.agent(app);
const agent2 = chai.request.agent(app);

describe('/signup', () => {
  it('Should be able to create new local users', (done) => {
    let tempAgent = chai.request.agent(app);
    tempAgent.post('/signup')
      .send({name: 'Hello World', email: 'temp@agent.com', password: 'test'})
      .then((res) => {
        expect(res).to.have.cookie;
        done();
      });
  });
  it('Should return error when attempting to create a user using an email that is already taken', (done) => {
    let tempAgentOne = chai.request.agent(app);
    let tempAgentTwo = chai.request.agent(app);
    tempAgentOne.post('/signup')
      .send({name: 'Hello World', email: 'temp@agent.com', password: 'test'})
      // Either remove the second account creation below, or reset database after each test
      .then(() => {
        return tempAgentTwo.post('/signup')
          .send({name: 'Hello World', email: 'temp@agent.com', password: 'test'});
      })
      // TODO - Figure out a less janky way to do this
      .catch(() => {
        done();
      });
  });
});