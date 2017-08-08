'use strict';

var path = require('path');
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require('./config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {models: {}};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ------- //
// SCHEMAS //
// ------- //

// USERS SCHEMA
var Users = sequelize.define('users', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    firstname: {
        type: Sequelize.STRING,
        notEmpty: true
    },
    lastname: {
        type: Sequelize.STRING,
        notEmpty: true
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
db.models.users = Users;

// CARDPACKS SCHEMA
var Cardpacks = sequelize.define('cardpacks', {
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
Cardpacks.belongsTo(Users, {
    foreignKey: 'owner_user_id'
});
db.models.cardpacks = Cardpacks;

// CARDS SCHEMA
var Cards = sequelize.define('cards', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    cardText: {
        type: Sequelize.STRING,
        notEmpty: true,
        allowNull: false
    },
    cardType: {
        type: Sequelize.STRING,
        notEmpty: true,
        allowNull: false
    }
});
Cards.belongsTo(Cardpacks, {
    foreignKey: 'cardpack_id'
});
db.models.cards = Cards;

// CARDPACK JOIN TABLE SCHEMA
// Allows for multiple uses to 'own' a cardpack
// while only allowing the owner that is specified
// in the cardpack entry to modify the pack
var CardpackShare = sequelize.define('cardpackshare', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    }
});
CardpackShare.belongsTo(Cardpacks, {
    foreignKey: 'cardpack_id'
});
CardpackShare.belongsTo(Users, {
    foreignKey: 'user_id'
});

// FRIENDS SCHEMA
var Friends = sequelize.define('friends', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    friender_accepted: {
        allowNull: false,
        type: Sequelize.BOOLEAN
    },
    friendee_accepted: {
        allowNull: false,
        type: Sequelize.BOOLEAN
    }
});
Friends.belongsTo(Users, {
    foreignKey: 'friender_id'
});
Friends.belongsTo(Users, {
    foreignKey: 'friendee_id'
});
db.friends = Friends;

// MESSAGES SCHEMA
var Messages = sequelize.define('messages', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
Messages.belongsTo(Users, {
    foreignKey: 'sender_id'
});
Messages.belongsTo(Users, {
    foreignKey: 'recipient_id'
});
db.messages = Messages;




module.exports = db;