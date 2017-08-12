var models = require('./models.js');

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
module.exports.addFriend = (frienderEmail, friendeeEmail, addType) => {
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