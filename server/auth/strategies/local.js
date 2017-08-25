const bCrypt = require('bcryptjs');

module.exports = (passport, userModel) => {
  let User = userModel;
  let LocalStrategy = require('passport-local').Strategy;
  passport.use('local-signup', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      let generateHash = (password) => {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };

      User.findOne({
        where: {
          email: email
        }
      }).then((user) => {
        if (user) {
          return done(null, false, {
            message: 'Email is already in use'
          });
        } else {
          let userPassword = generateHash(password);
          let data = {
            email: email,
            password: userPassword,
            firstname: req.body.firstname,
            lastname: req.body.lastname
          };
          User.create(data).then((newUser, created) => {
            if (!newUser) {
              return done(null, false);
            } else {
              return done(null, newUser);
            }
          })
            .catch((err) => {
              return done(null, false, {
                message: 'Email is invalid'
              });
            });
        }
      });
    }
  ));

  passport.use('local-signin', new LocalStrategy(
    {
      // Defaults to username and password, this overrides the username field to email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      let isValidPassword = (userpass, password) => {
        return bCrypt.compareSync(password, userpass);
      };
      User.findOne({
        where: {
          email: email
        }
      })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: 'Email does not exist'
            });
          }
          if (!isValidPassword(user.password, password)) {
            return done(null, false, {
              message: 'Incorrect password'
            });
          }
          let userInfo = user.get();
          return done(null, userInfo);
        }).catch((err) => {
          console.log('Error: ' + err);
          return done(null, false, {
            message: 'Something went wrong with your sign-in'
          });
        });
    }
  ));
};