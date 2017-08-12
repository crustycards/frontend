'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    let models = {};

    // ------- //
    // SCHEMAS //
    // ------- //

    // USERS SCHEMA
    let Users = sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        google_id: {
            type: Sequelize.STRING,
            unique: true
        },
        firstname: {
            type: Sequelize.STRING,
            notEmpty: true,
            allowNull: false
        },
        lastname: {
            type: Sequelize.STRING,
            notEmpty: true,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING
        }
    });
    models.users = Users;

    // CARDPACKS SCHEMA
    let Cardpacks = sequelize.define('cardpacks', {
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
    models.cardpacks = Cardpacks;

    // CARDS SCHEMA
    let Cards = sequelize.define('cards', {
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
    models.cards = Cards;

    // CARDPACK JOIN TABLE SCHEMA
    // Allows for multiple uses to 'own' a cardpack
    // while only allowing the owner that is specified
    // in the cardpack entry to modify the pack
    let CardpackShare = sequelize.define('cardpackshare', {
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
    models.cardpackjointable = CardpackShare;

    // FRIENDS SCHEMA
    let Friends = sequelize.define('friends', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        accepted: {
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
    models.friends = Friends;

    // MESSAGES SCHEMA
    let Messages = sequelize.define('messages', {
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
        foreignKey: 'receiver_id'
    });
    models.messages = Messages;


    return models;
}