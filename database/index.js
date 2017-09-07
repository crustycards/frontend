const Card = require('./models/card');
const Cardpack = require('./models/cardpack');
const Chatroom = require('./models/chatroom');
const Friend = require('./models/friend');
const Message = require('./models/message');
const User = require('./models/user');

const connection = require('./connection');

Card.model.belongsTo(Cardpack.model, {as: 'cardpack'});
Cardpack.model.belongsTo(User.model, {as: 'owner'});
Friend.model.belongsTo(User.model, {as: 'friender'});
Friend.model.belongsTo(User.model, {as: 'friendee'});
Message.model.belongsTo(User.model, {as: 'sender'});
Message.model.belongsTo(User.model, {as: 'receiver'});
User.model.belongsToMany(Cardpack.model, {through: 'cardpackSubscriptions', as: 'cardpack', foreignKey: 'subscriberId'});
Cardpack.model.belongsToMany(User.model, {through: 'cardpackSubscriptions', as: 'subscriber', foreignKey: 'cardpackId'});

module.exports = {
  Card,
  Cardpack,
  Chatroom,
  Friend,
  Message,
  User,
  connection
};