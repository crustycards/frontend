let router = require('express').Router();
let passport = require('passport');

// Middleware function that will redirect unauthenticated users to
// login screen when trying to access a page that uses this
var isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

router.get('/authtest', isLoggedIn, (req, res) => {
  res.send(JSON.stringify(req.user));
});

router.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}));
router.get('/auth/google/callback', passport.authenticate('google', {
  succesRedirect: '/googleSuccess',
  failureRedirect: '/googleFailure'
}));


// Allows passport local login on this page
router.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Allows passport local signup on this page
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup'
}));

// Destroys current session when entering this page (for any passport strategy)
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;