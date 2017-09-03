const db = require('../connection');
const Sequelize = require('sequelize');
const User = require('./user');
const Cardpack = require('./cardpack');

let CardModel = db.define('cards', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  text: {
    type: Sequelize.STRING,
    notEmpty: true,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    notEmpty: true,
    allowNull: false
  },
  answerFields: {
    type: Sequelize.INTEGER(1),
    notEmpty: true,
    allowNull: true
  }
});

let Card = {model: CardModel};

// Returns a promise that will resolve
// with the card data upon completion
//
// Exceptions:
// 1. cardpackId does not map to an existing cardpack
// 2. cardText is null/undefined/emptystring/notastring
// 3. cardType is not either 'black' or 'white'
Card.create = (userEmail, cardpackId, cardText, cardType, answerFields = 1) => {
  if (!cardType || (cardType !== 'black' && cardType !== 'white')) {
    return new Promise((resolve, reject) => {
      reject('Expected card type to be white or black, but instead received ' + cardType);
    });
  }
  if (!cardText || cardText.constructor !== String || cardText === '') {
    return new Promise((resolve, reject) => {
      reject('Expected card text to be a non-empty string, but instead received ' + cardText);
    });
  }
  if (cardType === 'black' && (answerFields === null || answerFields === undefined || answerFields.constructor !== Number)) {
    return new Promise((resolve, reject) => {
      reject('Expected answerFields to be a number, but instead received ' + answerFields);
    });
  }
  if (cardType === 'black' && (answerFields < 1 || answerFields > 3)) {
    return new Promise((resolve, reject) => {
      reject('Expected answerFields to be 1, 2, or 3 but it received ' + answerFields);
    });
  }

  return Cardpack.model.findOne({
    where: {id: cardpackId}
  })
    .then((cardpack) => {
      return User.getByEmail(userEmail)
        .then((user) => {
          if (user.id === cardpack.ownerId) {
            return Card.model.create({
              cardpackId: cardpackId,
              text: cardText,
              type: cardType,
              answerFields: cardType === 'black' ? answerFields : null
            });
          } else {
            return new Promise((resolve, reject) => {
              reject('Cannot create cards in a cardpack that you do not own');
            });
          }
        });
    })
    .then((card) => {
      return Card.getById(card.id);
    });
};

// Returns a promise that will resolve
// with the new card data once the card
//
// Exceptions:
// 1. cardId does not map to an existing card
// 2. cardData is uninterpretable
Card.update = (userEmail, cardId, cardText) => {
  if (!cardText || cardText.constructor !== String || cardText === '') {
    return new Promise((resolve, reject) => {
      reject('Card should be a non-empty string');
    });
  }

  return User.getByEmail(userEmail)
    .then((user) => {
      return Card.model.findOne({
        where: {id: cardId}
      })
        .then((card) => {
          if (!card) {
            return new Promise((resolve, reject) => {
              reject('Card ID does not map to an existing card');
            });
          }
          return Cardpack.model.findOne({
            where: {id: card.cardpackId}
          })
            .then((cardpack) => {
              if (cardpack.ownerId !== user.id) {
                return new Promise((resolve, reject) => {
                  reject('User does not own the cardpack that this card belongs to');
                });
              }
              return card.update({
                text: cardText
              });
            });
        });
    });
};

// Returns a promise that will resolve
// with no data once the card has been
// successfully deleted from the database
//
// Exceptions:
// 1. cardId does not map to an existing card
Card.delete = (userEmail, cardId) => {
  return User.getByEmail(userEmail)
    .then((user) => {
      return Card.getById(cardId)
        .then((card) => {
          if (!card) {
            return new Promise((resolve, reject) => {
              reject('Card ID does not map to an existing card');
            });
          }
          return Cardpack.model.findOne({
            where: {id: card.cardpack.id}
          })
            .then((cardpack) => {
              if (cardpack.ownerId !== user.id) {
                return new Promise((resolve, reject) => {
                  reject('User does not own this card');
                });
              }
              return card.destroy();
            });
        });
    });
};

// Returns a promise that will resolve
// with all cards in a given cardpack
//
// Exceptions:
// 1. cardpackId does not map to an existing cardpack
Card.getByCardpackId = (cardpackId) => {
  return Cardpack.model.findOne({
    where: {id: cardpackId}
  })
    .then((cardpack) => {
      if (!cardpack) {
        return new Promise((resolve, reject) => {
          reject('Cardpack ID does not map to an existing cardpack');
        });
      }
      return Card.model.findAll({
        where: {cardpackId: cardpackId}
      });
    });
};

Card.getById = (cardId) => {
  return Card.model.findById(cardId, {
    include: [{
      model: Cardpack.model,
      as: 'cardpack'
    }],
    attributes: {
      exclude: ['cardpackId']
    }
  })
    .then((card) => {
      if (!card) {
        throw new Error('Card ID does not map to an existing card');
      }
      return card;
    });
};

module.exports = Card;