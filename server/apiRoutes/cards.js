let router = require('express').Router();
let db = require('../../database');

module.exports = (socketHandler) => {
  router.get('/:cardpackId', (req, res) => {
    db.Card.getByCardpackId(req.params.cardpackId)
    .then((cards) => {
      res.json(cards);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  router.post('/:cardpackId', (req, res) => {
    let promises = [];
    let cards = req.body;
    cards.forEach((card) => {
      promises.push(
        db.Card.create(req.user.email, req.params.cardpackId, card.text, card.type)
          .then((card) => {
            socketHandler.respondToUsers([req.user], 'cardcreate', {card});
          })
      );
    });
    Promise.all(promises)
      .then(() => {
        res.json('success');
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });
  router.delete('/:cardId', (req, res) => {
    db.Card.delete(req.user.email, req.params.cardId)
    .then((card) => {
      res.json('success');
      socketHandler.respondToUsers([req.user], 'carddelete', {card});
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
  return router;
};