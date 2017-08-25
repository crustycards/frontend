module.exports = (socketHandler) => {
  const passport = require('passport');

  let router = require('express').Router();
  let db = require('../database');

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

  router.route('/messages')
    .get((req, res) => {
      // Get a list of messages with a particular user
      db.Message.getBetweenUsers(req.user.email, req.body.user)
      .then((messages) => {
        res.json(messages);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
    })
    .post((req, res) => {
      db.Message.create(req.user.email, req.body.user, req.body.text)
      .then((message) => {
        res.json(message);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
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
  
  // Returns array of all cardpacks owned by the requestor
  router.get('/cardpacks', (req, res) => {
    db.Cardpack.getByUserEmail(req.user.email)
    .then((cardpacks) => {
      res.json(cardpacks);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  // Returns the cardpack referenced by the specified ID
  router.get('/cardpacks/:id', (req, res) => {
    db.Cardpack.getById(req.params.id)
    .then((cardpack) => {
      res.json(cardpack);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  // Returns array of all cardpacks owned by the specified user
  router.get('/cardpacks/user/:user', (req, res) => {
    db.Cardpack.getByUserEmail(req.params.user)
    .then((cardpacks) => {
      res.json(cardpacks);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  // Creates a cardpack and sets the owner as the current user
  router.post('/cardpacks', (req, res) => {
    db.Cardpack.create(req.user.email, req.body.name)
    .then((cardpack) => {
      res.json('success');
      socketHandler.respondToUsers([req.user], 'cardpackcreate', cardpack);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  router.delete('/cardpacks', (req, res) => {
    db.Cardpack.delete(req.user.email, req.body.id)
    .then(() => {
      res.json('success');
      socketHandler.respondToUsers([req.user], 'cardpackdelete', {id: req.body.id});
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });

  router.get('/cards/:cardpackId', (req, res) => {
    db.Card.getByCardpackId(req.params.cardpackId)
    .then((cards) => {
      res.json(cards);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  router.post('/cards/:cardpackId', (req, res) => {
    db.Card.create(req.user.email, req.params.cardpackId, req.body.cardText, req.body.cardType)
    .then((card) => {
      res.json('success');
      socketHandler.respondToUsers([req.user], 'cardcreate', {card});
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  router.delete('/cards/:cardId', (req, res) => {
    db.Card.delete(req.user.email, req.params.cardId)
    .then((card) => {
      res.json('success');
      socketHandler.respondToUsers([req.user], 'carddelete', {card});
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