const chai = require('chai').use(require('chai-as-promised')).use(require('chai-http'));
const expect = chai.expect;
const request = chai.request(require('../server'));
const sinon = require('sinon');

module.exports.run = () => {
  describe('Test', () => {
    it('Should test', (done) => {
      request.get('/').end((err, res) => {
        expect(err).to.not.exist;
        expect(res).to.have.status(200);
        done();
      });
    });
  })
};