const fileHandler = require('../../../client/src/helpers/cardpackFileHandler');
const expect = require('chai').expect;

let dummyCards = [];
for (let i = 0; i < 100; i++) {
  let type = i % 3 ? 'white' : 'black';
  dummyCards.push({
    text: 'card' + i,
    type,
    answerFields: type === 'black' ? ((i % 3) + 1) : null
  });
}

it('Should get back deeply equal card objects after stringifying and re-parsing', () => {
  expect(fileHandler.parse(fileHandler.stringify(dummyCards))).to.eql(dummyCards);
});

describe('parse', () => {
  it('Should contain cardText and cardType properties for white cards', () => {
    let cards = fileHandler.parse('test card\r\nwhite');
    expect(cards[0].text).to.equal('test card');
    expect(cards[0].type).to.equal('white');
  });
  it('Should contain cardText, cardType, and playCount properties for black cards', () => {
    let cards = fileHandler.parse(
      'test card\r\nblack\r\n2' + '\r\n\r\n' + 'test card2\r\nblack\r\n1' + '\r\n\r\n' + 'test card3\r\nblack'
    );
    expect(cards[0].text).to.equal('test card');
    expect(cards[0].type).to.equal('black');
    expect(cards[0].answerFields).to.equal(2);
    expect(cards[1].text).to.equal('test card2');
    expect(cards[1].type).to.equal('black');
    expect(cards[1].answerFields).to.equal(1);
    expect(cards[2].text).to.equal('test card3');
    expect(cards[2].type).to.equal('black');
    expect(cards[2].answerFields).to.equal(1);
  });
  it('Should contain playCount property for black card even if none is explicitly provided', () => {
    let cards = fileHandler.parse('test card\r\nblack');
    expect(cards[0].text).to.equal('test card');
    expect(cards[0].type).to.equal('black');
    expect(cards[0].answerFields).to.equal(1);
  });
  it('Should parse multiple cards in one string', () => {
    let cards = fileHandler.parse(
      'test card\r\nblack\r\n\r\nother card\r\nwhite'
    );
    expect(cards[0].text).to.equal('test card');
    expect(cards[0].type).to.equal('black');
    expect(cards[0].answerFields).to.equal(1);
    expect(cards[1].text).to.equal('other card');
    expect(cards[1].type).to.equal('white');
  });
  it('Should throw an error when white card string contains more than two enter-separated elements', () => {
    expect(() => { fileHandler.parse('test card\r\nwhite\r\nasdf'); }).to.throw(Error, 'Expected two parameters on line 1 but got 3');
  });
  it('Should throw an error when white or black card string contains less than two enter-separated elements', () => {
    expect(() => { fileHandler.parse('test card'); }).to.throw(Error, 'Expected two parameters on line 1 but got 1');
  });
});

describe('stringify', () => {
  it('Should not modify input array', () => {
    let cardsNonref = JSON.parse(JSON.stringify(dummyCards));
    fileHandler.stringify(cardsNonref);
    expect(cardsNonref).to.eql(dummyCards);
  });
  it('Should correctly stringify an array of cards', () => {
    expect(fileHandler.stringify([{text: 'card', type: 'black'}])).to.equal('card\r\nblack');
  });
  it('Should throw error if input parameter is not an array', () => {
    expect(() => { fileHandler.stringify({}); }).to.throw(Error, 'Cards must be an array');
  });
  it('Should throw error if any card is missing text or type properties', () => {
    expect(() => { fileHandler.stringify([{text: 'card text'}]); }).to.throw(Error, 'Card is missing \'type\' property');
    expect(() => { fileHandler.stringify([{type: 'black'}]); }).to.throw(Error, 'Card is missing \'text\' property');
    expect(() => { fileHandler.stringify([{}]); }).to.throw(Error, 'Card is missing');
  });
});