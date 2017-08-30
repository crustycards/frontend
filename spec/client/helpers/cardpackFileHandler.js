const fileHandler = require('../../../client/src/helpers/cardpackFileHandler');
const expect = require('chai').expect;

describe('parse', () => {
  it('Should contain cardText and cardType properties for white cards', () => {
    let cards = fileHandler.parse(`test card, white`);
    expect(cards[0].cardText).to.equal('test card');
    expect(cards[0].cardType).to.equal('white');
  });
  it('Should contain cardText, cardType, and playCount properties for black cards', () => {
    let cards = fileHandler.parse(`test card, black, 2`);
    expect(cards[0].cardText).to.equal('test card');
    expect(cards[0].cardType).to.equal('black');
    expect(cards[0].cardPlayCount).to.equal(2);
  });
  it('Should contain playCount property for black card even if none is explicitly provided', () => {
    let cards = fileHandler.parse(`test card, black`);
    expect(cards[0].cardText).to.equal('test card');
    expect(cards[0].cardType).to.equal('black');
    expect(cards[0].cardPlayCount).to.equal(1);
  });
  it('Should parse multiple cards in one string', () => {
    let cards = fileHandler.parse(
      `test card, black
      other card, white`
    );
    expect(cards[0].cardText).to.equal('test card');
    expect(cards[0].cardType).to.equal('black');
    expect(cards[0].cardPlayCount).to.equal(1);
    expect(cards[1].cardText).to.equal('other card');
    expect(cards[1].cardType).to.equal('white');
  });
  it('Should throw an error when white card string contains more than two comma-separated elements', () => {
    expect(() => {fileHandler.parse(`test card, white, asdf`)}).to.throw(Error, 'Expected two parameters on line 1 but got 3');
  });
  it('Should throw an error when white or black card string contains less than two comma-separated elements', () => {
    expect(() => {fileHandler.parse(`test card`)}).to.throw(Error, 'Expected two parameters on line 1 but got 1');
  });
});

describe('stringify', () => {
});