const db = require('../connection');
const Sequelize = require('sequelize');

// Allows for multiple uses to 'own' a cardpack
// while only allowing the owner that is specified
// in the cardpack entry to modify the pack
const CardpackSubscribeModel = db.define('cardpacksubscribe', {
});

let CardpackSubscribe = {model: CardpackSubscribeModel};

// TODO - Implement these functions
CardpackSubscribe.subscribe = (userEmail, cardpackId) => {
};

CardpackSubscribe.unsubscribe = (userEmail, cardpackId) => {
};

module.exports = CardpackSubscribe;