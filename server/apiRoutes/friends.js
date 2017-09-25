let router = require('express').Router();
let db = require('../../database');

module.exports = (socketHandler) => {
  router.route('/')
    .get((req, res) => {
      // Get a list of all friends and pending friend requests
      db.Friend.get(req.user.email)
        .then((data) => {
          res.json(data);
        });
    })
    .post((req, res) => {
      if (req.body.type === 'request') {
        db.Friend.sendRequest(req.user.email, req.body.user)
          .then(() => {
            return db.User.getByEmail(req.body.user)
              .then((friendee) => {
                return {friender: req.user, friendee};
              });
          })
          .then((users) => {
            socketHandler.respondToUsers([users.friender], 'action', {
              type: 'home/ADD_SENT_FRIEND_REQUEST',
              payload: users.friendee
            });
            socketHandler.respondToUsers([users.friendee], 'action', {
              type: 'home/ADD_RECEIVED_FRIEND_REQUEST',
              payload: users.friender
            });
            res.json('success');
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      } else if (req.body.type === 'accept') {
        db.Friend.acceptRequest(req.user.email, req.body.user)
          .then(() => {
            return db.User.getByEmail(req.body.user)
              .then((acceptor) => {
                return {acceptor, acceptee: req.user};
              });
          })
          .then((users) => {
            socketHandler.respondToUsers([users.acceptor], 'action', {
              type: 'home/ADD_FRIEND',
              payload: users.acceptee
            });
            socketHandler.respondToUsers([users.acceptee], 'action', {
              type: 'home/ADD_FRIEND',
              payload: users.acceptor
            });
            res.json('success');
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      } else {
        res.status(500).send('Did not specify whether a friend request was sent or accepted');
      }
    })
    .delete((req, res) => {
      db.Friend.remove(req.user.email, req.body.user)
        .then(() => {
          return db.User.getByEmail(req.body.user)
            .then((unfriendee) => {
              return {unfriender: req.user, unfriendee};
            });
        })
        .then((users) => {
          socketHandler.respondToUsers([users.unfriender], 'action', {
            type: 'home/REMOVE_FRIEND',
            payload: users.unfriendee
          });
          socketHandler.respondToUsers([users.unfriendee], 'action', {
            type: 'home/REMOVE_FRIEND',
            payload: users.unfriender
          });
          res.json('success');
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    });

  // TODO - Write tests for this endpoint
  router.get('/online', (req, res) => {
    db.Friend.get(req.user.email)
      .then((friendData) => {
        let usersOnline = socketHandler.getUsersOnline();
        res.json(friendData.friends.filter((friend) => usersOnline.includes(friend.email)));
      });
  });

  return router;
};