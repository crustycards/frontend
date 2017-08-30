const expect = require('chai').use(require('chai-as-promised')).expect;
const BlackCardDeck = require('../../games/blackCardDeck.js');

describe('BlackCardDeck', () => {
  let cards = [];
  for (let i = 0; i < 10; i++) {
    cards.push({
      id: i + 1,
      name: 'card ' + (i + 1)
    });
  }
  let deck;
  beforeEach(() => {
    let cardsNonref = JSON.parse(JSON.stringify(cards));
    deck = new BlackCardDeck(cardsNonref);
  });

  it('Should set a current card upon creation', () => {
    expect(deck.currentCard).to.exist;
    expect(deck.currentCard).to.be.a('object');
  });
  it('Should cycle through cards and always have a current card', () => {
    for (let i = 0; i < 100; i++) {
      let card = cards.filter((card) => {
        return card.id === deck.currentCard.id;
      })[0];
      expect(deck.currentCard.id).to.exist;
      deck.cycleCard();
    }
  });
  it('Should properly store cards in the card draw/discard pile', () => {
    for (let i = 0; i < 100; i++) {
      deck.drawPile.forEach((card) => {
        expect(card.id).to.exist;
      });
      deck.discardPile.forEach((card) => {
        expect(card.id).to.exist;
      });
      deck.cycleCard();
    }
  });
  it('Should retain deck size over time', () => {
    for (let i = 0; i < 100; i++) {
      expect(deck.size()).to.equal(cards.length);
      deck.cycleCard();
    }
  });
  it('Should reshuffle cards when attempting to draw from an empty draw pile, and should not loose any cards in the process', () => {
    expect(deck.drawPile.length).to.equal(cards.length - 1);
    // Goes to cards.length - 1 because the first max length of the array is one minus the length of the inpur array of cards
    for (let i = 0; i < cards.length - 1; i++) {
      deck.cycleCard();
      expect(deck.drawPile.length).to.equal(cards.length - i - 2);
    }
    expect(deck.drawPile.length).to.equal(0); // Redundant, but here for clarification
    deck.cycleCard();
    // -2 because at this point, one card is in the discard and one card is in play
    expect(deck.drawPile.length).to.equal(cards.length - 2);
  });
});