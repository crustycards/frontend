module.exports.parse = (string) => {
  let cards = [];
  let cardRows = string.split(/\n/);
  cardRows.forEach((row, i) => {
    let cardParts = row.split(`,`);
    let cardText = cardParts[0];
    cardText = cardText ? cardText.trim() : null;
    let cardType = cardParts[1];
    cardType = cardType ? cardType.trim() : null;
    if (cardType === 'black') {
      if (!(cardParts.length === 2 || cardParts.length === 3)) {
        throw new Error('Expected either two or three parameters on line ' + (i + 1) + ' but got ' + cardParts.length);
      }
    } else if (cardParts.length !== 2) {
      throw new Error('Expected two parameters on line ' + (i + 1) + ' but got ' + cardParts.length);
    }
    let card = {cardText, cardType};
    if (card.cardType === 'black') {
      let cardPlayCount = cardParts[2] || '1';
      cardPlayCount = cardPlayCount.trim();
      cardPlayCount = parseInt(cardPlayCount);
      card.cardPlayCount = cardPlayCount;
    }
    if (!(card.cardType === 'black' || card.cardType === 'white')) {
      throw new Error('Line ' + (i + 1) + ': card type must be either black or white, not ' + card.cardType);
    }
    cards.push(card);
  });
  return cards;
};

module.exports.stringify = (cards) => {
};