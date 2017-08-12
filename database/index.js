let models = require('./models.js');
let helpers = require('./helpers.js');

// Accepts a user's email and returns the
// user stored in the database
//
// Exceptions:
// 1. userEmail does not map to any existing users
module.exports.getUser = (userEmail) => {
  return models.users.findOne({
    where: {
      email: userEmail
    }
  })
  .then((userData) => {
    if (userData === null) {
      return new Promise((resolve, reject) => {
        reject('No user is registered under ' + userEmail);
      });
    } else {
      delete userData.dataValues.password; // Prevents password from being sent over http/sockets
      return userData.dataValues;
    }
  });
};



// Returns a promise that will resolve with an array
// containing all messages between the two users
//
// Exceptions:
// 1. senderEmail does not map to an existing user
// 2. receiverEmail does not map to an existing user
module.exports.getMessages = (senderEmail, receiverEmail) => {
  // return models.messages.findAll({
  //   where: {
  //     $or: [
  //       {
  //         sender_id: senderId,
  //         receiver_id: receiverId
  //       },
  //       {
  //         sender_id: receiverId,
  //         receiver_id: senderId
  //       }
  //     ]
  //   }
  // });
};

// Adds a message that was sent from one person to another
// and returns a promise that will resolve to the message
// contents including the database-stored timestamp
//
// Exceptions:
// 1. senderEmail does not map to an existing user
// 2. receiverEmail does not map to an existing user
// 3. text is null/undefined/emptystring/notastring
module.exports.addMessage = (senderEmail, receiverEmail, text) => {
  // if (text !== null && text !== undefined && text.constructor === String && text !== '') {
  //   // Doesn't use the user data, simply runs the functions
  //   // to see if they throw errors due to invalid user IDs
  //   return module.exports.getUser({id: senderId})
  //   .then((sender) => {
  //     return module.exports.getUser({id: receiverId});
  //   })
  //   .then((receiver) => {
  //     return models.messages.create({
  //       sender_id: senderId,
  //       receiver_id: receiverId,
  //       text: text
  //     });
  //   });
  // } else {
  //   return new Promise((resolve, reject) => {
  //     reject('Message text is blank');
  //   });
  // }
};

module.exports.sendFriendRequest = (frienderEmail, friendeeEmail) => {
};

module.exports.acceptFriendRequest = (acceptorEmail, accepteeEmail) => {
};

// Wipes any friend relationship between two users
// by removing either a friend request OR a friendship
// and returns a promise that will resolve with no data
//
// Exceptions:
// 1. unfrienderEmail does not map to an existing user
// 2. unfriendeeEmail does not map to an existing user
module.exports.removeFriend = (unfrienderEmail, unfriendeeEmail) => {
  return module.exports.getUser({id: unfrienderUserId})
  .then((friender) => {
    return module.exports.getUser({id: unfriendeeUserId});
  }).then((friendee) => {
    // Destroy the friendship
  });
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
// 1. userEmail does not map to an existing user
module.exports.getFriendData = (userEmail) => {
  // return module.exports.getUser({id: userId})
  // .then((user) => {
  //   // Get friend data
  // });
};



// Returns a promise that will resolve with the cardpack data
// (userId represents the owner of the cardpack)
//
// Exceptions:
// 1. userEmail does not map to an existing user
// 2. cardpackName is null/undefined/emptystring/notastring
module.exports.createCardpack = (userEmail, cardpackName) => {
};

// Returns a promise that will resolve with no
// data once the cardpack and all associated cards
// have been removed from the database
//
// Exceptions:
// 1. userEmail does not map to an existing user
// 1. cardpackId does not map to an existing cardpack
module.exports.deleteCardpack = (userEmail, cardpackId) => {
};

// Returns a promise that will resolve with an array
// containing all cardpacks that the user owns or is
// subscribed to
//
// Exceptions:
// 1. userEmail does not map to an existing user
module.exports.getCardpacks = (userEmail) => {
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