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
    type: Sequelize.INTEGER,
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
Card.create = ({userId, cardpackId, text, type, answerFields = 1}) => {
  if (!type || (type !== 'black' && type !== 'white')) {
    return Promise.reject('Expected card type to be white or black, but instead received ' + type);
  }
  if (!text || text.constructor !== String || text === '') {
    return Promise.reject('Expected card text to be a non-empty string, but instead received ' + text);
  }
  if (type === 'black' && (answerFields === null || answerFields === undefined || answerFields.constructor !== Number)) {
    return Promise.reject('Expected answerFields to be a number, but instead received ' + answerFields);
  }
  if (type === 'black' && (answerFields < 1 || answerFields > 3)) {
    return Promise.reject('Expected answerFields to be 1, 2, or 3 but it received ' + answerFields);
  }

  return Cardpack.getById(cardpackId)
    .then((cardpack) => {
      return User.getById(userId)
        .then((user) => {
          if (user.id === cardpack.owner.id) {
            return Card.model.create({
              cardpackId,
              text,
              type,
              answerFields: type === 'black' ? answerFields : null
            });
          } else {
            return Promise.reject('Cannot create cards in a cardpack that you do not own');
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
    return Promise.reject('Card should be a non-empty string');
  }

  return User.getByEmail(userEmail)
    .then((user) => {
      return Card.model.findOne({
        where: {id: cardId}
      })
        .then((card) => {
          if (!card) {
            return Promise.reject('Card ID does not map to an existing card');
          }
          return Cardpack.model.findOne({
            where: {id: card.cardpackId}
          })
            .then((cardpack) => {
              if (cardpack.ownerId !== user.id) {
                return Promise.reject('User does not own the cardpack that this card belongs to');
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
            return Promise.reject('Card ID does not map to an existing card');
          }
          if (card.cardpack.ownerId !== user.id) {
            return Promise.reject('User does not own this card');
          }
          return card.destroy();
        });
    });
};

// Returns a promise that will resolve
// with all cards in a given cardpack
//
// Exceptions:
// 1. cardpackId does not map to an existing cardpack
Card.getByCardpackId = (cardpackId) => {
  return Cardpack.getById(cardpackId)
    .then((cardpack) => {
      return Card.model.findAll({ where: { cardpackId } });
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