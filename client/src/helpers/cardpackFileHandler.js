module.exports.parse = (string) => {
  const cardpack = JSON.parse(string);

  if (typeof cardpack.whiteCards !== 'object' || cardpack.whiteCards.constructor !== Array) {
    throw new Error('White cards must be an array');
  }

  if (typeof cardpack.blackCards !== 'object' || cardpack.blackCards.constructor !== Array) {
    throw new Error('Black cards must be an array');
  }

  const whiteCards = cardpack.whiteCards.map(whiteCard => ({
    text: whiteCard.text
  }));

  const blackCards = cardpack.blackCards.map(blackCard => ({
    text: blackCard.text,
    answerFields: blackCard.answerFields || 1
  }));

  return { whiteCards, blackCards };
};

module.exports.stringify = ({whiteCards, blackCards}) => {
  if (typeof whiteCards !== 'object' || whiteCards.constructor !== Array) {
    throw new Error('White cards must be an array');
  }
  if (typeof blackCards !== 'object' || blackCards.constructor !== Array) {
    throw new Error('Black cards must be an array');
  }

  return JSON.stringify({
    whiteCards: whiteCards.map(whiteCard => ({
      text: whiteCard.text
    })),
    blackCards: blackCards.map(blackCard => ({
      text: blackCard.text,
      answerFields: blackCard.answerFields || 1
    }))
  }, null, 2).replace(/\n/g, '\r\n');
};