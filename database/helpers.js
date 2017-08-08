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
// This function has no error handling!!!
// If either/both of the user IDs do not map to existing
// users, the returned promise will resolve to an empty
// array
module.exports.getMessages = (senderId, receiverId) => {
  return models.messages.findAll({
    where: {
      $or: [
        {
          sender_id: senderId,
          receiver_id: receiverId
        },
        {
          sender_id: receiverId,
          receiver_id: senderId
        }
      ]
    }
  });
};

// Adds a message that was sent from one person to another
// and returns a promise that will resolve to the message
// contents including the database-stored timestamp
//
// Exceptions:
// 1. senderId does not map to an existing user
// 2. receiverId does not map to an existing user
// 3. text is null/undefined/emptystring/notastring
module.exports.addMessage = (senderId, receiverId, text) => {
  if (text !== null && text !== undefined && text.constructor === String && text !== '') {
    // Doesn't use the user data, simply runs the functions
    // to see if they throw errors due to invalid user IDs
    return module.exports.getUser({id: senderId})
    .then((sender) => {
      return module.exports.getUser({id: receiverId});
    })
    .then((receiver) => {
      return models.messages.create({
        sender_id: senderId,
        receiver_id: receiverId,
        text: text
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      reject('Message text is blank');
    });
  }
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
  if (addType !== null && addType !== undefined && addType.constructor === String && (addType === 'create' || addType === 'accept')) {
    return module.exports.getUser({id: frienderUserId})
    .then((friender) => {
      return module.exports.getUser({id: friendeeUserId});
    })
    .then((friendee) => {
      // Both users have been checked
      return models.friends.findAll({
        where: {
          $or: [
            {
              friender_id: frienderUserId,
              friendee_id: friendeeUserId
            },
            {
              friender_id: friendeeUserId,
              friendee_id: frienderUserId
            }
          ]
        }
      });
    })
    .then((friendData) => {
      if (friendData.length > 1) {
        return new Promise((resolve, reject) => {
          reject(`Friend data is corrupted: Expected at most one friendship between users ${frienderUserId} and ${friendeeUserId} but instead found ${friendData.length}`);
        });
      }
      if (addType === 'create') {
        if (friendData.length === 0) {
          // Create friend request
        } else {
          // No changes are made
        }
      }
      if (addType === 'accept') {
        if (friendData.length === 1) {
          // Accept friend request
        } else {
          // No changes are made
        }
      }
    });
  } else {
    return new Promise((resolve, reject) => {
      reject(`Expected addType to equal either 'create' or 'accept', but instead it equals: ${addType}`);
    });
  }
};

// Wipes any friend relationship between two users
// by removing either a friend request OR a friendship
// and returns a promise that will resolve with no data
//
// Exceptions:
// 1. unfrienderId does not map to an existing user
// 2. unfriendeeId does not map to an existing user
module.exports.removeFriend = (unfrienderUserId, unfriendeeUserId) => {
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
// 1. userId does not map to an existing user
module.exports.getFriendData = (userId) => {
  return module.exports.getUser({id: userId})
  .then((user) => {
    // Get friend data
  });
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