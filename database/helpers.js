var models = require('./models.js');

module.exports.models = models.models;
module.exports.sequelize = models.sequelize;
module.exports.Sequelize = models.Sequelize;

// TODO - Find a less ugly way to export everything from models.js
models = models.models; // Since models exports an object containing the models in a key called models

// Accepts an object containing one piece of data and
// returns a promise that will resolve with the entire
// data of the user except for the user's password hash
module.exports.getUsers = (userInfoObj) => {
  return models.users.findAll({
    where: userInfoObj
  });
};

// Accepts an object containing one piece of unique data
// (email or userID in the case of users) and returns a
// promise that will resolve with the entire data of the
// user except for the user's password hash
//
// Exceptions:
// 1. userInfoObj does not map to any existing users
// 2. userInfoObj maps to more than one user
module.exports.getUser = (userInfoObj) => {
  return module.exports.getUsers(userInfoObj).then((userData) => {
    if (userData.length === 1) {
      return userData;
    } else {
      if (userData.length > 1) {
        return new Promise((resolve, reject) => {
          reject('There are multiple users that match the criteria');
        });
      }
      if (userData.length < 1) {
        return new Promise((resolve, reject) => {
          reject('There are no users that match the criteria');
        });
      }
    }
  });
};



// Returns a promise that will resolve with an array
// containing all messages between the two users
//
// Exceptions:
// 1. senderId does not map to an existing user
// 2. recipientId does not map to an existing user
module.exports.getMessages = (senderId, recipientId) => {
};

// Adds a message that was sent from one person to another
// and returns a promise that will resolve to the message
// contents including the database-stored timestamp
//
// Exceptions:
// 1. senderId does not map to an existing user
// 2. recipientId does not map to an existing user
// 3. text is null/undefined/emptystring/notastring
module.exports.addMessage = (senderId, recipientId, text) => {
};



// Adds a user-to-user friend relationship, automatically
// disallowing duplicate duplicate entries, and returning
// a promise with the new friendship status between the
// two users
//
// AddType is a string containing either 'create' or 'accept'
//
// Exceptions:
// 1. frienderId does not map to an existing user
// 2. friendeeId does not map to an existing user
// 3. addType is not either 'create' or 'accept'
module.exports.addFriend = (frienderUserId, friendeeUserId, addType) => {
};

// Wipes any friend relationship between two users
// by removing either a friend request OR a friendship
// and returns a promise that will resolve with no data
//
// Exceptions:
// 1. unfrienderId does not map to an existing user
// 2. unfriendeeId does not map to an existing user
module.exports.removeFriend = (unfrienderUserId, unfriendeeUserId) => {
};

// Returns a promise containing an object that has data about friends and open friend requests
// -------------------------------------------------------------------------------------------
// This is done all in one method because all friend data is searched through anyway, so if
// more than one data set is needed then only one search is performed
//
// Output Format: {friends: [], friendRequestsSent: [], friendRequestsReceived: []}
// Where each array contains a list of user objects
//
// Exceptions:
// 1. userId does not map to an existing user
module.exports.getFriendData = (userId) => {
};



// Returns a promise that will resolve with the cardpack data
// (userId represents the owner of the cardpack)
//
// Exceptions:
// 1. userId does not map to an existing user
// 2. cardpackName is null/undefined/emptystring/notastring
module.exports.createCardpack = (userId, cardpackName) => {
};

// Returns a promise that will resolve with no
// data once the cardpack and all associated cards
// have been removed from the database
//
// Exceptions:
// 1. cardpackId does not map to an existing cardpack
module.exports.deleteCardpack = (cardpackId) => {
};

// Returns a promise that will resolve with an array
// containing all cardpacks that the user owns or is
// subscribed to
//
// Exceptions:
// 1. userId does not map to an existing user
module.exports.getCardpacks = (userId) => {
};



// Returns a promise that will resolve
// with the card data upon completion
//
// Exceptions:
// 1. cardpackId does not map to an existing cardpack
// 2. cardText is null/undefined/emptystring/notastring
// 3. cardType is not either 'black' or 'white'
module.exports.createCard = (cardpackId, cardText, cardType) => {
};

// Returns a promise that will resolve
// with the new card data once the card
//
// Exceptions:
// 1. cardId does not map to an existing card
// 2. cardData is uninterpretable
module.exports.updateCard = (cardId, cardData) => {
};

// Returns a promise that will resolve
// with no data once the card has been
// successfully deleted from the database
//
// Exceptions:
// 1. cardId does not map to an existing card
module.exports.deleteCard = (cardId) => {
};

// Returns a promise that will resolve
// with all cards in a given cardpack
//
// Exceptions:
// 1. cardpackId does not map to an existing cardpack
module.exports.getCards = (cardpackId) => {
};