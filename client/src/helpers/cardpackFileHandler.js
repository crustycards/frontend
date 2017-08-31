// TODO - Handle cards that have commas in the card text

module.exports.parse = (string) => {
  let cards = [];
  let cardStrings = string.split(/\r\n\r\n/);
  cardStrings.forEach((row, i) => {
    let cardParts = row.split(/\r\n/);
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
    let card = {text: cardText, type: cardType};
    if (card.type === 'black') {
      let answerFields = cardParts[2] || '1';
      answerFields = answerFields.trim();
      answerFields = parseInt(answerFields);
      card.answerFields = answerFields;
    } else {
      card.answerFields = null;
    }
    if (!(card.type === 'black' || card.type === 'white')) {
      throw new Error('Line ' + (i + 1) + ': card type must be either black or white, not ' + card.type);
    }
    cards.push(card);
  });
  return cards;
};

// TODO - Write tests for this
module.exports.stringify = (cards) => {
  let cardString = '';
  cards.forEach((card, i) => {
    cardString += card.text + '\r\n' + card.type + (card.answerFields ? '\r\n' + card.answerFields : '');
    if (i + 1 < cards.length) {
      cardString += '\r\n\r\n';
    }
  });
  return cardString;
};