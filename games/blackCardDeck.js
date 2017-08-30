const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class BlackCardDeck {
  constructor (cards) {
    this.drawPile = cards;
    this.discardPile = [];
    this.currentCard = undefined;
    this.cycleCard();
  }

  cycleCard () {
    // 'Shuffle' discard pile if draw pile is empty
    if (this.drawPile.length === 0) {
      this.drawPile = this.discardPile;
      this.discardPile = [];
    }
    // Useful when creating a new game and no current black card is set
    if (this.currentCard) {
      this.discardPile.push(this.currentCard);
    }
    let cardIndex = getRandomInt(0, this.drawPile.length - 1);
    this.currentCard = this.drawPile.splice(cardIndex, 1)[0];
  }

  size () {
    return this.drawPile.length + this.discardPile.length + (this.currentCard ? 1 : 0);
  }
}

module.exports = BlackCardDeck;