const db = require('../database');

// Accepts an array of cardpack IDs and returns a promise resolving to an object in the format...
// {blackCards: [], whiteCards: []}
module.exports.getCardsFromCardpackIds = (cardpackIds) => {
  let promises = [];
  let blackCards = [];
  let whiteCards = [];
  cardpackIds.forEach((packId) => {
    promises.push(
      db.Card.getByCardpackId(packId)
        .then((cards) => {
          cards.forEach((card) => {
            if (card.type === 'black') {
              blackCards.push(card);
            } else if (card.type === 'white') {
              whiteCards.push(card);
            }
          });
        })
    );
  });
  return Promise.all(promises)
    .then(() => {
      return {blackCards, whiteCards};
    });
};