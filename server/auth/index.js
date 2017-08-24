const localAuth = require('./strategies/local');
const googleAuth = require('./strategies/google.js');
const userSerializeDeserialize = require('./user');

module.exports = (passport, userModel) => {
  localAuth(passport, userModel);
  googleAuth(passport, userModel);
  userSerializeDeserialize(passport, userModel);
};