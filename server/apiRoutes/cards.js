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
    let socketCards = [];
    cards.forEach((card) => {
      promises.push(
        db.Card.create(req.user.email, req.params.cardpackId, card.text, card.type, card.answerFields)
          .then((card) => {
            socketCards.push(card);
          })
      );
    });
    Promise.all(promises)
      .then(() => {
        socketHandler.respondToUsers([req.user], 'cardcreate', {cards: socketCards});
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