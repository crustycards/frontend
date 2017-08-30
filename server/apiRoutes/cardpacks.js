let router = require('express').Router();
let db = require('../../database');

module.exports = (socketHandler) => {
  // Returns array of all cardpacks owned by the requestor
  router.get('/', (req, res) => {
    db.Cardpack.getByUserEmail(req.user.email)
    .then((cardpacks) => {
      res.json(cardpacks);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  // Returns the cardpack referenced by the specified ID
  router.get('/:id', (req, res) => {
    db.Cardpack.getById(req.params.id)
    .then((cardpack) => {
      res.json(cardpack);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  // Returns array of all cardpacks owned by the specified user
  router.get('/user/:user', (req, res) => {
    db.Cardpack.getByUserEmail(req.params.user)
    .then((cardpacks) => {
      res.json(cardpacks);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  // Creates a cardpack and sets the owner as the current user
  router.post('/', (req, res) => {
    db.Cardpack.create(req.user.email, req.body.name)
    .then((cardpack) => {
      res.json('success');
      socketHandler.respondToUsers([req.user], 'cardpackcreate', cardpack);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  router.delete('/', (req, res) => {
    db.Cardpack.delete(req.user.email, req.body.id)
    .then(() => {
      res.json('success');
      socketHandler.respondToUsers([req.user], 'cardpackdelete', {id: req.body.id});
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  return router;
};