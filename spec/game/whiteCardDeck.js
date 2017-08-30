const expect = require('chai').use(require('chai-as-promised')).expect;
const WhiteCardDeck = require('../../games/whiteCardDeck.js');

describe('WhiteCardDeck', () => {
  let cards = [];
  for (let i = 0; i < 50; i++) {
    cards.push({
      id: i + 1,
      name: 'card ' + (i + 1)
    });
  }
  let deck;
  beforeEach(() => {
    let cardsNonref = JSON.parse(JSON.stringify(cards));
    deck = new WhiteCardDeck(cardsNonref);
  });

  it('Should have no current cards upon creation', () => {
    expect(deck.currentCards).to.exist;
    expect(deck.currentCards).to.be.a('object');
    expect(Object.keys(deck.currentCards).length).to.equal(0);
  });
  it('Should set draw pile to the cards that are passed in', () => {
    expect(deck.drawPile.length).to.equal(cards.length);
  });
  describe('pop()', () => {
    it('Should remove card from draw pile', () => {
      let card = deck.popCard();
      expect(card.id).to.exist;
      expect(deck.drawPile.length).to.equal(cards.length - 1);
    });
  });
  describe('discardCards()', () => {
    it('Should add cards passed in to the discard pile', () => {
      deck.discardCards(deck.popCard());
      expect(deck.size()).to.equal(cards.length);
    });
  });
  describe('playCard()', () => {
    it('Should play card if none has been played by the user', () => {
      user = {id: 1, name: 'test', email: 'test@test.test'};
      deck.playCard(user, deck.popCard());
      expect(deck.size()).to.equal(cards.length);
    });
    it('Should throw error when attempting to play card after already playing one this round', () => {
      user = {id: 1, name: 'test', email: 'test@test.test'};
      deck.playCard(user, deck.popCard());
      expect(() => {deck.playCard(user, deck.popCard())}).to.throw(Error, 'You have already played a card this round');
    });
  });
  describe('resetCurrentCards()', () => {
    it('Should remove all cards from current cards', () => {
      user = {id: 1, name: 'test', email: 'test@test.test'};
      deck.playCard(user, deck.popCard());
      expect(Object.keys(deck.currentCards).length).to.equal(1);
      deck.resetCurrentCards();
      expect(Object.keys(deck.currentCards).length).to.equal(0);
      expect(deck.size()).to.equal(cards.length);
    });
  });
});