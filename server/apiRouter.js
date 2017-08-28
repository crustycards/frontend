const passport = require('passport');
const db = require('../database');

module.exports = (socketHandler) => {
  let router = require('express').Router();

  router.use('/messages', require('./apiRoutes/messages')(socketHandler));
  router.use('/cardpacks', require('./apiRoutes/cardpacks')(socketHandler));
  router.use('/cards', require('./apiRoutes/cards')(socketHandler));
  router.use('/friends', require('./apiRoutes/friends')(socketHandler));

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

  router.get('/*', (req, res) => {
    res.status(500).send('Invalid api request');
  });

  return router;
};