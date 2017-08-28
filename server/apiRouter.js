const passport = require('passport');
const db = require('../database');

module.exports = (socketHandler) => {
  let router = require('express').Router();

  router.use('/messages', require('./apiRoutes/messages')(socketHandler));
  router.use('/cardpacks', require('./apiRoutes/cardpacks')(socketHandler));
  router.use('/cards', require('./apiRoutes/cards')(socketHandler));

  // Returns data about the user who sent this request
  router.get('/currentuser', (req, res) => {
    if (req.user) {
      let currentUser = req.user;
      delete currentUser.password;
      res.json(currentUser || null);
    } else {
      res.status(500).send('Not logged in');
    }
  });

  router.route('/friends')
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
            socketHandler.respondToUsers([users.friender, users.friendee], 'friendrequestsend', {
              friender: users.friender,
              friendee: users.friendee
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
              .then((acceptee) => {
                return {acceptor: req.user, acceptee};
              });
          })
          .then((users) => {
            socketHandler.respondToUsers([users.acceptor, users.acceptee], 'friendrequestaccept', {
              acceptor: users.acceptor,
              acceptee: users.acceptee
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
          socketHandler.respondToUsers([users.unfriender, users.unfriendee], 'unfriend', {
            unfriender: users.unfriender,
            unfriendee: users.unfriendee
          });
          res.json('success');
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    });

  router.get('/*', (req, res) => {
    res.status(500).send('Invalid api request');
  });

  return router;
};