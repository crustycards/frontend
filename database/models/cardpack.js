const db = require('../connection');
const Sequelize = require('sequelize');
const User = require('./user');

const CardpackModel = db.define('cardpacks', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    notEmpty: true,
    allowNull: false
  }
});

let Cardpack = {model: CardpackModel};

// Returns a promise that will resolve with the cardpack data
//
// Exceptions:
// 1. userEmail does not map to an existing user
// 2. cardpackName is null/undefined/emptystring/notastring
Cardpack.create = (userEmail, cardpackName) => {
  if (!cardpackName || cardpackName.constructor !== String) {
    return Promise.reject('Cardpack name is invalid - name must be a non-empty string');
  }

  return User.getByEmail(userEmail)
    .then((user) => {
      return Cardpack.model.create({
        name: cardpackName,
        ownerId: user.id
      })
        .then((cardpack) => {
          return Cardpack.getById(cardpack.id);
        });
    });
};

// Returns a promise that will resolve with an array
// containing all cardpacks that the user owns or is
// subscribed to
//
// Exceptions:
// 1. userEmail does not map to an existing user
Cardpack.getByUserEmail = (userEmail) => {
  return User.getByEmail(userEmail)
    .then((user) => {
      return Cardpack.model.findAll({
        where: {
          ownerId: user.id
        },
        include: [{
          model: User.model,
          as: 'owner'
        }],
        attributes: {
          exclude: ['ownerId']
        }
      });
    });
};

Cardpack.getById = (cardpackId) => {
  return Cardpack.model.findById(cardpackId, {
    include: [{
      model: User.model,
      as: 'owner'
    }],
    attributes: {
      exclude: ['ownerId']
    }
  })
    .then((cardpack) => {
      if (!cardpack) {
        throw new Error('Cardpack does not exist');
      }
      return cardpack;
    });
};

// Returns a promise that will resolve with no
// data once the cardpack and all associated cards
// have been removed from the database
//
// Exceptions:
// 1. userEmail does not map to an existing user
// 1. cardpackId does not map to an existing cardpack
Cardpack.delete = (userEmail, cardpackId) => {
  return User.getByEmail(userEmail)
    .then((owner) => {
      return Cardpack.getById(cardpackId)
        .then((cardpack) => {
          if (cardpack.owner.id !== owner.id) {
            return Promise.reject('Cannot delete someone else\'s cardpack');
          }

          return Cardpack.model.findAll({
            where: {id: cardpackId}
          })
            .then((cards) => {
              let cardDestructionPromises = [];
              cards.forEach((card) => {
                cardDestructionPromises.push(
                  card.destroy()
                );
              });
              return Promise.all(cardDestructionPromises);
            })
            .then(() => {
              return cardpack.destroy();
            })
            .then(() => {
              return true;
            });
        });
    });
};

Cardpack.subscribe = (userEmail, cardpackId) => {
  return User.getByEmail(userEmail)
    .then((user) => {
      return Cardpack.getById(cardpackId)
        .catch(() => {
          throw new Error('Cardpack does not exist');
        })
        .then((cardpack) => {
          // TODO - Use bare sequelize cardpack.model.findone so that we can use cardpack.ownerId instead of cardpack.owner.id
          if (cardpack.owner.id === user.id) {
            throw new Error('Cannot subscribe to your own cardpack');
          }
          return cardpack.addSubscriber(user)
            .then((created) => {
              if (created) {
              // TODO - handle socket events here
              }
              return true;
            });
        });
    });
};

Cardpack.unsubscribe = (userEmail, cardpackId) => {
  return User.getByEmail(userEmail)
    .then((user) => {
      return Cardpack.getById(cardpackId)
        .then((cardpack) => {
          return cardpack.removeSubscriber(user);
        })
        .then((destroyed) => {
          if (destroyed) {
            // TODO - Add socket events here
            return true;
          } else {
            throw new Error('Cannot unsubscribe from a cardpack that you are not subscribed to');
          }
        });
    });
};

Cardpack.getSubscriptions = (userEmail) => {
  // TODO - Stop cardpacksubscriptions key from being added
  return User.model.findOne({
    where: {
      email: userEmail
    },
    include: [{
      model: Cardpack.model,
      as: 'cardpack',
      include: [{
        model: User.model,
        as: 'owner',
        attributes: {
          exclude: ['password']
        }
      }],
      attributes: {
        exclude: ['ownerId']
      }
    }]
  })
    .then((data) => {
      if (data) {
        return data.cardpack;
      } else {
        throw new Error('User does not exist');
      }
    });
};

module.exports = Cardpack;