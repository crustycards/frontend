const router = require('express').Router();
const db = require('../../database');

const Games = require('../../games');
let games = new Games();

let isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

module.exports = (socketHandler) => {
  router.route('/')
    .get((req, res) => {
      // Return all current games
      res.json(games.getAll());
    })
    .post(isLoggedIn, (req, res) => {
      // Create new game
      db.User.getById(req.user.id)
        .then((user) => {
          games.createGame({creator: user, gameName: req.body.gameName, cardpackIds: req.body.cardpackIds, timeout: req.body.timeout, maxPlayers: req.body.maxPlayers})
            .then((game) => {
              res.json('success');
              socketHandler.respondToAllUsers('gamecreate', game);
            })
            .catch((err) => {
              res.status(500).json(err);
            });
        });
    });
  
  router.post('/join', isLoggedIn, (req, res) => {
    // Join game
    try {
      let data = games.joinGame(req.user, req.body.gameName);
      res.json(data);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  router.post('/leave', isLoggedIn, (req, res) => {
    // Leave game that user is currently in
    try {
      let data = games.leaveGame(req.user);
      res.json(data);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
  router.get('/current', isLoggedIn, (req, res) => {
    // Get game state for game that user is currently in
    try {
      let state = games.getStateFor(req.user);
      res.json(state);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  router.post('/current/card', isLoggedIn, (req, res) => {
    try {
      games.playCard(req.user, req.body);
      res.json('success');
    } catch (err) {
      res.status(500).send(err);
    }
  });
  return router;
};