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