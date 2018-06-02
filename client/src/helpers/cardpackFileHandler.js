module.exports.parse = (string) => {
  let whiteCards = [];
  let blackCards = [];

  const whiteCardString = string.split('White Cards\r\n\r\n')[1].split('Black Cards\r\n\r\n')[0].trim();
  const blackCardString = string.split('Black Cards\r\n\r\n')[1].trim();

  whiteCardString.split('\r\n\r\n').forEach(singleCardString => {
    const lines = singleCardString.split('\r\n');
    whiteCards.push({text: lines[0]});
  });

  blackCardString.split('\r\n\r\n').forEach(singleCardString => {
    const lines = singleCardString.split('\r\n');
    blackCards.push({text: lines[0], answerFields: parseInt(lines[1])});
  });

  return { whiteCards, blackCards };











  // let cards = [];
  // let lines = string.split(/\r\n\r\n/);
  // lines.forEach((row, i) => {
  //   let cardParts = row.split(/\r\n/);
  //   let cardText = cardParts[0];
  //   cardText = cardText ? cardText.trim() : null;
  //   let cardType = cardParts[1];
  //   cardType = cardType ? cardType.trim() : null;
  //   if (cardType === 'black') {
  //     if (!(cardParts.length === 2 || cardParts.length === 3)) {
  //       throw new Error('Expected either two or three parameters on line ' + (i + 1) + ' but got ' + cardParts.length);
  //     }
  //   } else if (cardParts.length !== 2) {
  //     throw new Error('Expected two parameters on line ' + (i + 1) + ' but got ' + cardParts.length);
  //   }
  //   let card = {text: cardText, type: cardType};
  //   if (card.type === 'black') {
  //     let answerFields = cardParts[2] || '1';
  //     answerFields = answerFields.trim();
  //     answerFields = parseInt(answerFields);
  //     card.answerFields = answerFields;
  //   } else {
  //     card.answerFields = null;
  //   }
  //   if (!(card.type === 'black' || card.type === 'white')) {
  //     throw new Error('Line ' + (i + 1) + ': card type must be either black or white, not ' + card.type);
  //   }
  //   cards.push(card);
  // });
  // return cards;
};

module.exports.stringify = ({whiteCards, blackCards}) => {
  if (typeof whiteCards !== 'object' || whiteCards.constructor !== Array) {
    throw new Error('White cards must be an array');
  }
  if (typeof blackCards !== 'object' || blackCards.constructor !== Array) {
    throw new Error('Black cards must be an array');
  }

  let whiteCardString = whiteCards.reduce((acc, card) => `${acc}${card.text}\r\n\r\n`, '').trim();

  let blackCardString = blackCards.reduce((acc, card) => `${acc}${card.text}${'\r\n'}${card.answerFields}\r\n\r\n`, '').trim();

  return `White Cards\r\n\r\n${whiteCardString}\r\n\r\n\r\nBlack Cards\r\n\r\n${blackCardString}`;
};