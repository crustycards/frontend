let router = require('express').Router();
let db = require('../../database');

module.exports = (socketHandler) => {
  router.route('/')
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
      // TODO - Send socket data here
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  return router;
};