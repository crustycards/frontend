const db = require('../connection');
const Sequelize = require('sequelize');
const User = require('./user');

const FriendModel = db.define('friends', {
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

let Friend = {model: FriendModel};

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
const addFriend = (frienderEmail, friendeeEmail, addType) => {
  if (!addType || addType.constructor !== String && (addType !== 'create' || addType !== 'accept')) {
    return Promise.reject(`Expected addType to equal either 'create' or 'accept', but instead it equals: ${addType}`);
  }
  if (frienderEmail === friendeeEmail) {
    return Promise.reject('Cannot friend yourself');
  }

  return User.getByEmail(frienderEmail)
    .then((friender) => {
      return User.getByEmail(friendeeEmail)
        .then((friendee) => {
          return {friender, friendee};
        });
    })
    .then((friends) => {
      return Friend.model.findOne({
        where: {
          $or: [
            {
              frienderId: friends.friender.id,
              friendeeId: friends.friendee.id
            },
            {
              frienderId: friends.friendee.id,
              friendeeId: friends.friender.id
            }
          ]
        }
      })
        .then((friendData) => {
          return {friends, friendStatus: friendData || null};
        });
    })
    .then((friendshipData) => {
      if (addType === 'create' && !friendshipData.friendStatus) {
      // Create friend request
        return Friend.model.create({
          frienderId: friendshipData.friends.friender.id,
          friendeeId: friendshipData.friends.friendee.id,
          accepted: false
        })
          .then((friendshipStatus) => {
            return Friend.model.findById(friendshipStatus.id, {
              include: [{
                model: User.model,
                as: 'friender'
              }, {
                model: User.model,
                as: 'friendee'
              }],
              attributes: {
                exclude: ['frienderId', 'friendeeId']
              }
            });
          });
      } else if (addType === 'accept' && friendshipData.friendStatus) {
      // Set friend request to accepted only if you are the receiver of the request
        if (friendshipData.friends.friender.id === friendshipData.friendStatus.dataValues.friendeeId) {
        // If the request recipient accepts the request, change the request to the accepted state and return it
          return friendshipData.friendStatus.update({
            accepted: true
          })
            .then((newFriendshipStatus) => {
              return Friend.model.findById(newFriendshipStatus.id, {
                include: [{
                  model: User.model,
                  as: 'friender'
                }, {
                  model: User.model,
                  as: 'friendee'
                }],
                attributes: {
                  exclude: ['frienderId', 'friendeeId']
                }
              });
            });
        } else {
          return Promise.reject('Cannot accept a friend request that does not exist');
        }
      } else {
      // If the original request sender tries to accept, return the current request status without modifying it
        if (addType === 'create') {
          return Promise.reject('There is already an open friend request between you and this person');
        } else {
          return Promise.reject('Cannot send a friend request to a person that has already sent you a request');
        }
      }
    });
};

Friend.sendRequest = (frienderEmail, friendeeEmail) => {
  return addFriend(frienderEmail, friendeeEmail, 'create');
};

Friend.acceptRequest = (acceptorEmail, accepteeEmail) => {
  return addFriend(acceptorEmail, accepteeEmail, 'accept');
};

// Wipes any friend relationship between two users
// by removing either a friend request OR a friendship
// and returns a promise that will resolve with no data
//
// Exceptions:
// 1. unfrienderEmail does not map to an existing user
// 2. unfriendeeEmail does not map to an existing user
Friend.remove = (unfrienderEmail, unfriendeeEmail) => {
  return User.getByEmail(unfrienderEmail)
    .then((unfriender) => {
      return User.getByEmail(unfriendeeEmail)
        .then((unfriendee) => {
          return {unfriender, unfriendee};
        });
    }).then((friends) => {
      return Friend.model.findOne({
        where: {
          $or: [
            {
              frienderId: friends.unfriender.id,
              friendeeId: friends.unfriendee.id
            },
            {
              frienderId: friends.unfriendee.id,
              friendeeId: friends.unfriender.id
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
        return Promise.reject('You are not friends with this person');
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
Friend.get = (userEmail) => {
  return User.getByEmail(userEmail)
    .then((user) => {
      return Friend.model.findAll({
        where: {
          $or: [
            {
              frienderId: user.id
            },
            {
              friendeeId: user.id
            }
          ]
        }
      })
        .then((userRelationsData) => {
          let getUserPromises = [];
          for (let i = 0; i < userRelationsData.length; i++) {
            getUserPromises.push(
              User.getById(userRelationsData[i].dataValues.frienderId)
                .then((friender) => {
                  userRelationsData[i].dataValues.friender = friender;
                  delete userRelationsData[i].dataValues.frienderId;
                })
            );
            getUserPromises.push(
              User.getById(userRelationsData[i].dataValues.friendeeId)
                .then((friendee) => {
                  userRelationsData[i].dataValues.friendee = friendee;
                  delete userRelationsData[i].dataValues.friendeeId;
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
              if (userRelationsData[i].dataValues.accepted === true) {
                friends.push(userRelationsData[i].dataValues.friendee);
              } else {
                requestsSent.push(userRelationsData[i].dataValues.friendee);
              }
            } else {
              // User is friendee
              if (userRelationsData[i].dataValues.accepted === true) {
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

module.exports = Friend;