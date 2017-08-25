const db = require('../connection');
const Sequelize = require('sequelize');
const User = require('./user');

const MessageModel = db.define('messages', {
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

let Message = {model: MessageModel};

// Adds a message that was sent from one person to another
// and returns a promise that will resolve to the message
// contents including the database-stored timestamp
//
// Exceptions:
// 1. senderEmail does not map to an existing user
// 2. receiverEmail does not map to an existing user
// 3. text is null/undefined/emptystring/notastring
Message.create = (senderEmail, receiverEmail, text) => {
  if (!text || text.constructor !== String) {
    return new Promise((resolve, reject) => {
      reject('Expected message text to be a non-empty string');
    });
  }

  return User.getByEmail(senderEmail)
    .then((sender) => {
      return User.getByEmail(receiverEmail)
        .then((receiver) => {
          return {sender, receiver};
        });
    })
    .then((users) => {
      return Message.model.create({
        senderId: users.sender.id,
        receiverId: users.receiver.id,
        text: text
      }, {
        include: [{
          model: User.model,
          as: 'sender'
        }, {
          model: User.model,
          as: 'receiver'
        }]
      })
        .then((messageData) => {
          return messageData.dataValues;
        })
        .then((message) => {
          delete message.senderId;
          delete message.receiverId;
          message.sender = users.sender;
          message.receiver = users.receiver;
          return message;
        });
    });
};

// Returns a promise that will resolve with an array
// containing all messages between the two users
//
// Exceptions:
// 1. senderEmail does not map to an existing user
// 2. receiverEmail does not map to an existing user
Message.getBetweenUsers = (senderEmail, receiverEmail) => {
  return User.getByEmail(senderEmail)
    .then((sender) => {
      return User.getByEmail(receiverEmail)
        .then((receiver) => {
          return {sender, receiver};
        });
    })
    .then((users) => {
      return Message.model.findAll({
        where: {
          $or: [
            {
              senderId: users.sender.id,
              receiverId: users.receiver.id
            },
            {
              senderId: users.receiver.id,
              receiverId: users.sender.id
            }
          ]
        },
        include: [{
          model: User.model,
          as: 'sender'
        }, {
          model: User.model,
          as: 'receiver'
        }]
      })
        .then((messagesImm) => {
          let messages = JSON.parse(JSON.stringify(messagesImm)); // TODO - FIX THIS
          messages.forEach((message) => {
            delete message.senderId;
            delete message.receiverId;
          });
          return messages;
        });
    });
};

module.exports = Message;