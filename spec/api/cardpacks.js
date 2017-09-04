const chai = require('chai').use(require('chai-as-promised')).use(require('chai-http'));
const expect = chai.expect;
const app = require('../../server').listen(8080);
const db = require('../../database');
const request = chai.request(app);
const sinon = require('sinon');
const agent = chai.request.agent(app);
const agent2 = chai.request.agent(app);

describe('/api/cardpacks', () => {
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
        expect(cardpacks.length).to.equal(0);
      })
      .then(() => {
        return agent.post('/api/cardpacks')
          .send({name: 'test cardpack'});
      })
      .then(() => {
        agent.get('/api/cardpacks')
          .end((err, res) => {
            expect(err).to.not.exist;
            let cardpacks = res.body;
            expect(cardpacks).to.be.a('array');
            expect(cardpacks.length).to.equal(1);
            done();
          });
      });
  });
  it('Should get cardpacks of specific user when performing a GET with a particular user specified', (done) => {
    agent.post('/api/cardpacks')
      .send({name: 'test cardpack'})
      .then(() => {
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
  });
  it('Should return an error when retrieving cardpacks for a user that does not exist', (done) => {
    agent.get('/api/cardpacks/user/' + 'fake@email.com')
      .end((err, res) => {
        expect(err).to.exist;
        done();
      });
  });

  it('Should get cardpack by ID when performing a GET with a particular cardpack ID specified', (done) => {
    agent.post('/api/cardpacks')
      .send({name: 'test cardpack'})
      .then(() => {
        agent2.get('/api/cardpacks/' + 1)
          .end((err, res) => {
            expect(err).to.not.exist;
            let cardpack = res.body;
            expect(cardpack).to.be.a('object');
            expect(cardpack.name).to.equal('test cardpack');
            done();
          });
      });
  });
  it('Should return an error when retrieving a cardpack by an ID that does not map to an existing cardpack', (done) => {
    agent.get('/api/cardpacks/' + 123456789)
      .end((err, res) => {
        expect(err).to.exist;
        done();
      });
  });

  it('Should return error when attempting to delete a cardpack that you do not own', (done) => {
    agent.post('/api/cardpacks')
      .send({name: 'test cardpack'})
      .then(() => {
        agent2.delete('/api/cardpacks')
          .send({id: 1})
          .end((err, res) => {
            expect(err).to.exist;
            done();
          });
      });
  });
  it('Should succeed when deleting a cardpack that you own', (done) => {
    agent.post('/api/cardpacks')
      .send({name: 'test cardpack'})
      .then(() => {
        agent.delete('/api/cardpacks')
          .send({id: 1})
          .end((err, res) => {
            expect(err).to.not.exist;
            expect(res.body).to.equal('success');
            done();
          });
      });
  });
});