let router = require('express').Router();
let passport = require('passport');

// Middleware function that will redirect authenticated users from
// login/signup pages so that they don't get the impression that they
// aren't logged in even if they are
var isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
};

router.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}));
router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Redirects these pages to homepage if the user is logged in already
router.get('/login', isNotLoggedIn);
router.get('/signup', isNotLoggedIn);

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