const db = require('../connection');
const Sequelize = require('sequelize');

// Allows for multiple uses to 'own' a cardpack
// while only allowing the owner that is specified
// in the cardpack entry to modify the pack
const CardpackSubscribeModel = db.define('cardpacksubscriptions', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  }
});

let CardpackSubscribe = {model: CardpackSubscribeModel};

module.exports = CardpackSubscribe;