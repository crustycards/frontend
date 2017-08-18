module.exports = (socketHandler) => {
  const passport = require('passport');
  const auth = require('./authHelpers.js');

  let router = require('express').Router();
  let db = require('../database');

  // Returns data about the user who sent this request
  router.get('/currentuser', auth.isLoggedIn, (req, res) => {
    let currentUser = req.user;
    delete currentUser.password;
    res.json(currentUser);
  });

  router.route('/messages')
    .get(auth.isLoggedIn, (req, res) => {
      // Get a list of messages with a particular user
      db.getMessages(req.user.email, req.body.user)
      .then((messages) => {
        res.json(messages);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
    })
    .post(auth.isLoggedIn, (req, res) => {
      console.log(req.body);
      db.addMessage(req.user.email, req.body.user, req.body.text)
      .then((message) => {
        res.json(message);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
    });

  router.route('/friends')
    .get(auth.isLoggedIn, (req, res) => {
      // Get a list of all friends and pending friend requests
      db.getFriendData(req.user.email)
      .then((data) => {
        res.json(data);
      });
    })
    .post(auth.isLoggedIn, (req, res) => {
      if (req.body.type === 'request') {
        db.sendFriendRequest(req.user.email, req.body.user)
        .then(() => {
          return db.getUser(req.body.user)
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
        db.acceptFriendRequest(req.user.email, req.body.user)
        .then(() => {
          return db.getUser(req.body.user)
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
    .delete(auth.isLoggedIn, (req, res) => {
      db.removeFriend(req.user.email, req.body.user)
      .then(() => {
        return db.getUser(req.body.user)
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
  
  // Returns array of all cardpacks owned by the requestor
  router.get('/cardpacks', (req, res) => {
    db.getCardpacks(req.user.email)
    .then((cardpacks) => {
      res.send(cardpacks);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  // Returns array of all cardpacks owned by the specified user
  router.get('/cardpacks/:user', (req, res) => {
    db.getCardpacks(req.params.user)
    .then((cardpacks) => {
      res.send(cardpacks);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  // Creates a cardpack and sets the owner as the current user
  router.post('/cardpacks', auth.isLoggedIn, (req, res) => {
    db.createCardpack(req.user.email, req.body.name)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  router.delete('/cardpacks', auth.isLoggedIn, (req, res) => {
    db.deleteCard(req.user.email, req.body.id)
    .then((dbResponse) => {
      res.send(dbResponse);
    })
    .catch((error) => {
      res.send({error});
    });
  });

  router.get('cards/:cardpackId', (req, res) => {
    res.send();
  });
  router.post('/cards/:cardpackId', (req, res) => {
    res.send();
  });
  router.delete('/cards/:cardId', (req, res) => {
    res.send();
  });

  router.get('/*', (req, res) => {
    res.send('Invalid api request');
  });

  return router;
};