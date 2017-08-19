const auth = require('./authHelpers.js');

let router = require('express').Router();
let passport = require('passport');

router.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}));
router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Redirects these pages to homepage if the user is logged in already
router.get('/login', auth.isNotLoggedIn);
router.get('/signup', auth.isNotLoggedIn);
router.get('/', auth.isLoggedIn);

// Allows passport local login on this page
router.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/'
}));

// Allows passport local signup on this page
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/'
}));

// Destroys current session when entering this page (for any passport strategy)
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;