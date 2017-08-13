module.exports = (sockets) => {
  const passport = require('passport');
  const auth = require('./authHelpers.js');

  let router = require('express').Router();
  let db = require('../database');

  // Returns data about the user who sent this request
  router.get('/currentuser', auth.isLoggedIn, (req, res) => {
    res.send(JSON.stringify(req.user));
  });

  router.get('/messages', auth.isLoggedIn, (req, res) => {
    // Get a list of messages with a particular user
    db.getMessages(req.user.email, req.query.user)
    .then(JSON.stringify)
    .then(res.send)
    .catch((error) => {
      res.send(JSON.stringify({error}));
    });
  });

  router.get('/friends', auth.isLoggedIn, (req, res) => {
    // Get a list of all friends and pending friend requests
    db.getFriendData(req.user.email).then(JSON.stringify).then((data) => {
      res.send(data);
    });
  });
  router.post('/friends', auth.isLoggedIn, (req, res) => {
    db.sendFriendRequest(req.user.email, req.body.user)
    .then(() => {
      res.send(JSON.stringify({message: 'success'}))
    })
    .catch((error) => {
      res.send(JSON.stringify({error}));
    });
  });
  router.delete('/friends', auth.isLoggedIn, (req, res) => {
    // Remove friend request/friend
  });

  // Expects another user's email in req.body.userEmail
  // and then adds a friend request with that particular user
  router.post('/friends', auth.isLoggedIn, (req, res) => {
    var friender = req.user;
    var friendee;
    db.getUser({email: req.body.userEmail}).then((user) => {
      friendee = user;
    }).then(() => {
      return db.addFriend(friender.id, friendee.id, 'create');
    }).catch((err) => {
      res.send('The email you entered is not linked to an existing user');
    }).then((data) => {
      if (data) {
        for (var key in sockets) {
          if (friender.id.toString() === key || friendee.id.toString() === key) {
            sockets[key].emit('add friend send request', JSON.stringify({friender, friendee}));
          }
        }
        res.send('Friend request sent');
      } else {
        res.send('Something went wrong when submitting friend request');
      }
    });
  });
  // TODO - Link these together
  router.post('/friends', auth.isLoggedIn, (req, res) => {
    var friender = req.user;
    var friendee;
    db.getUser({id: req.body.friendId}).then((user) => {
      friendee = user;
      return db.addFriend(friender.id, friendee.id, 'accept')
    }).then(() => {
      for (var key in sockets) {
        if (friender.id.toString() === key || friendee.id.toString() === key) {
          sockets[key].emit('add friend accept request', JSON.stringify({friender, friendee}));
        }
      }
      res.send('Friend request accepted');
    });
  });

  router.delete('/friends', auth.isLoggedIn, (req, res) => {
    var unfriender = req.user;
    var unfriendee;
    db.getUser({id: req.body.friendId}).then((user) => {
      unfriendee = user;
      db.removeFriend(unfriender.id, unfriendee.id)
    }).then(() => {
      for (var key in sockets) {
        if (unfriender.id.toString() === key || unfriendee.id.toString() === key) {
          sockets[key].emit('remove friend', JSON.stringify({unfriender, unfriendee}));
        }
      }
      res.send('Friend successfully removed');
    });
  });

  router.get('/*', (req, res) => {
    res.send();
  });

  return router;
};