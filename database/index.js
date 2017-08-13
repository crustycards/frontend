const config = require('./config.js');
const Sequelize = require('sequelize');

let sequelize = new Sequelize(config.database, config.username, config.password, config);
let models = require('./models.js')(sequelize);

module.exports.models = models;
module.exports.sequelize = sequelize;

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
    if (!userData) {
      return new Promise((resolve, reject) => {
        reject('No user is registered under ' + userEmail);
      });
    } else {
      delete userData.dataValues.password; // Prevents password from being sent over http/sockets
      return userData.dataValues;
    }
  });
};

var getUserById = (userId) => {
  return models.users.findOne({
    where: {
      id: userId
    }
  })
  .then((userData) => {
    if (!userData) {
      return new Promise((resolve, reject) => {
        reject('No user has ID ' + userId);
      });
    } else {
      delete userData.dataValues.password;
      return userData.dataValues;
    }
  });
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
  if (!text || text.constructor !== String) {
    return new Promise((resolve, reject) => {
      reject('Message has no text');
    });
  }

  return module.exports.getUser(senderEmail)
  .then((sender) => {
    return module.exports.getUser(receiverEmail)
    .then((receiver) => {
      return {sender, receiver};
    });
  })
  .then((users) => {
    return models.messages.create({
      sender_id: users.sender.id,
      receiver_id: users.receiver.id,
      text: text
    });
  })
  .then((messageData) => {
    return messageData.dataValues;
  });
};

// Returns a promise that will resolve with an array
// containing all messages between the two users
//
// Exceptions:
// 1. senderEmail does not map to an existing user
// 2. receiverEmail does not map to an existing user
module.exports.getMessages = (senderEmail, receiverEmail) => {
  return module.exports.getUser(senderEmail)
  .then((sender) => {
    return module.exports.getUser(receiverEmail)
    .then((receiver) => {
      return {sender, receiver};
    })
  })
  .then((users) => {
    return models.messages.findAll({
      where: {
        $or: [
          {
            sender_id: users.sender.id,
            receiver_id: users.receiver.id
          },
          {
            sender_id: users.receiver.id,
            receiver_id: users.sender.id
          }
        ]
      }
    });
  })
  .then((messages) => {
    return replaceForeignKeys(messages, 'sender_id', models.users, 'sender');
  })
  .then((messages) => {
    return replaceForeignKeys(messages, 'receiver_id', models.users, 'receiver');
  });
};

module.exports.sendFriendRequest = (frienderEmail, friendeeEmail) => {
  if (frienderEmail === friendeeEmail) {
    return new Promise((resolve, reject) => {
      reject('Cannot friend yourself');
    });
  }
  return addFriend(frienderEmail, friendeeEmail, 'create');
};

module.exports.acceptFriendRequest = (acceptorEmail, accepteeEmail) => {
  return addFriend(acceptorEmail, accepteeEmail, 'accept');
};

// Wipes any friend relationship between two users
// by removing either a friend request OR a friendship
// and returns a promise that will resolve with no data
//
// Exceptions:
// 1. unfrienderEmail does not map to an existing user
// 2. unfriendeeEmail does not map to an existing user
module.exports.removeFriend = (unfrienderEmail, unfriendeeEmail) => {
  return module.exports.getUser(unfrienderEmail)
  .then((unfriender) => {
    return module.exports.getUser(unfriendeeEmail)
    .then((unfriendee) => {
      return {unfriender, unfriendee};
    });
  }).then((friends) => {
    return models.friends.findOne({
      where: {
        $or: [
          {
            friender_id: friends.unfriender.id,
            friendee_id: friends.unfriendee.id
          },
          {
            friender_id: friends.unfriendee.id,
            friendee_id: friends.unfriender.id
          }
        ]
      }
    });
  })
  .then((friendship) => {
    if (friendship) {
      return friendship.destroy()
      .then(() => {
        return true;
      });
    } else {
      return new Promise((resolve, reject) => {
        reject('You are not friends with this person');
      });
    }
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
  return module.exports.getUser(userEmail)
  .then((user) => {
    return models.friends.findAll({
      where: {
        $or: [
          {
            friender_id: user.id
          },
          {
            friendee_id: user.id
          }
        ]
      }
    })
    .then((userRelationsData) => {
      let getUserPromises = [];
      for (let i = 0; i < userRelationsData.length; i++) {
        getUserPromises.push(
          getUserById(userRelationsData[i].dataValues.friender_id)
          .then((friender) => {
            userRelationsData[i].dataValues.friender = friender;
            delete userRelationsData[i].dataValues.friender_id;
          })
        );
        getUserPromises.push(
          getUserById(userRelationsData[i].dataValues.friendee_id)
          .then((friendee) => {
            userRelationsData[i].dataValues.friendee = friendee;
            delete userRelationsData[i].dataValues.friendee_id;
          })
        );
      }
      return Promise.all(getUserPromises)
      .then(() => {
        return userRelationsData;
      });
    })
    .then((userRelationsData) => {
      let friends = [];
      let requestsSent = [];
      let requestsReceived = [];

      for (let i = 0; i < userRelationsData.length; i++) {
        if (userRelationsData[i].dataValues.friender.email === userEmail) {
          // User is friender
          if (userRelationsData[i].dataValues.accepted ===  true) {
            friends.push(userRelationsData[i].dataValues.friendee);
          } else {
            requestsSent.push(userRelationsData[i].dataValues.friendee);
          }
        } else {
          // User is friendee
          if (userRelationsData[i].dataValues.accepted ===  true) {
            friends.push(userRelationsData[i].dataValues.friender);
          } else {
            requestsReceived.push(userRelationsData[i].dataValues.friender);
          }
        }
      }

      return {friends, requestsSent, requestsReceived};
    });
  });
};



// Returns a promise that will resolve with the cardpack data
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







// Adds a user-to-user friend relationship, automatically
// disallowing duplicate duplicate entries, and returning
// a promise with the new friendship status between the
// two users
//
// AddType is a string containing either 'create' or 'accept'
//
// Exceptions:
// 1. frienderEmail does not map to an existing user
// 2. friendeeEmail does not map to an existing user
// 3. addType is not either 'create' or 'accept'
let addFriend = (frienderEmail, friendeeEmail, addType) => {
  if (!addType || addType.constructor !== String && (addType !== 'create' || addType !== 'accept')) {
    return new Promise((resolve, reject) => {
      reject(`Expected addType to equal either 'create' or 'accept', but instead it equals: ${addType}`);
    });
  }

  return module.exports.getUser(frienderEmail)
  .then((friender) => {
    return module.exports.getUser(friendeeEmail)
    .then((friendee) => {
      return {friender, friendee};
    });
  })
  .then((friends) => {
    return models.friends.findOne({
      where: {
        $or: [
          {
            friender_id: friends.friender.id,
            friendee_id: friends.friendee.id
          },
          {
            friender_id: friends.friendee.id,
            friendee_id: friends.friender.id
          }
        ]
      }
    })
    .then((friendData) => {
      let friendStatus = null;
      if (friendData) {
        friendStatus = friendData;
      }
      return {friends, friendStatus};
    });
  })
  .then((friendshipData) => {
    if (addType === 'create' && !friendshipData.friendStatus) {
      // Create friend request
      return models.friends.create({
        friender_id: friendshipData.friends.friender.id,
        friendee_id: friendshipData.friends.friendee.id,
        accepted: false
      })
      .then((friendshipData) => {
        return friendshipData.dataValues;
      })
      .then((friendship) => {
        delete friendship.friender_id;
        delete friendship.friendee_id;
        friendship.friender = friendshipData.friends.friender;
        friendship.friendee = friendshipData.friends.friendee;
        return friendship;
      });
    } else if (addType === 'accept' && friendshipData.friendStatus) {
      // Set friend request to accepted only if you are the receiver of the request
      if (friendshipData.friends.friender.id === friendshipData.friendStatus.dataValues.friendee_id) {
        // If the request recipient accepts the request, change the request to the accepted state and return it
        return friendshipData.friendStatus.update({
          accepted: true
        })
        .then((newFriendshipStatus) => {
          return newFriendshipStatus.dataValues;
        })
        .then((friendship) => {
          delete friendship.friender_id;
          delete friendship.friendee_id;
          friendship.friender = friendshipData.friends.friender;
          friendship.friendee = friendshipData.friends.friendee;
          return friendship;
        });
      } else {
        return new Promise((resolve, reject) => {
          reject('There is already an open friend request with this person');
        });
      }
    } else {
      // If the original request sender tries to accept, return the current request status without modifying it
      return new Promise((resolve, reject) => {
        reject('There is already an open friend request with this person');
      });
    }
  });
};

let replaceForeignKeys = (modelArrayImmutable, foreignKey, foreignModel, newKey) => {
  let modelArray = JSON.parse(JSON.stringify(modelArrayImmutable));
  let promiseArray = [];
  for (let i = 0; i < modelArray.length; i++) {
    promiseArray.push(
      foreignModel.findOne({
        where: {id: modelArray[i][foreignKey]}
      })
      .then((model) => {
        delete modelArray[i][foreignKey];
        modelArray[i][newKey] = model;
      })
    );
  }
  return Promise.all(promiseArray)
  .then(() => {
    return modelArray;
  });
};