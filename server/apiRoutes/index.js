module.exports = (socketHandler) => {
  let router = require('express').Router();

  router.use('/messages', require('./messages')(socketHandler));
  router.use('/cardpacks', require('./cardpacks')(socketHandler));
  router.use('/cards', require('./cards')(socketHandler));
  router.use('/friends', require('./friends')(socketHandler));
  router.use('/games', require('./games')(socketHandler));

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