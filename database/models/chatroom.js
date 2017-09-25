const db = require('../connection');
const Sequelize = require('sequelize');

// TODO - Implement this

const ChatroomModel = db.define('messages', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  isPrivate: {
    type: Sequelize.BOOLEAN,
    notEmpty: true,
    allowNull: false
  }
});

let Chatroom = {model: ChatroomModel};

module.exports = Chatroom;