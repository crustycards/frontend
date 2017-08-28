const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class WhiteCardDeck {
  constructor (cards) {
    this.drawPile = cards;
    this.discardPile = [];
    this.currentCards = {};
  }

  popCard () {
    return this.drawPile.splice(getRandomInt(0, this.drawPile.length - 1), 1)[0];
  }

  discardCards (cards) {
    this.discardPile = this.discardPile.concat(cards);
  }

  playCard (user, card) {
    if (this.currentCards[user.email]) {
      throw new Error('You have already played a card this round');
    }
    this.currentCards[user.email] = card;
  }

  resetCurrentCards () {
    Object.keys(this.currentCards).forEach((key, index) => {
      let card = this.currentCards[key];
      delete this.currentCards[key];
      this.discardPile.push(card);
    });
  }

  size () {
    return this.drawPile.length + this.discardPile.length + Object.keys(this.currentCards).length;
  }
}

module.exports = WhiteCardDeck;