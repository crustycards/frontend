const GoogleStrategy = require('passport-google-oauth2').Strategy;
const googleConfig = require('../googleConfig.json');
const GOOGLE_CLIENT_ID = googleConfig.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = googleConfig.GOOGLE_CLIENT_SECRET;
const callbackURL = googleConfig.callbackURL;

module.exports = (passport, userModel) => {
  let User = userModel;
  passport.use(new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
      passReqToCallback: true
    },
    (reqest, token, refreshToken, profile, done) => {
      process.nextTick(() => {
        User.findOne({
          where: {
            google_id: profile.id
          }
        })
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            console.log(profile.name);
            User.create({
              google_id: profile.id,
              token: token,
              firstname: profile.name.givenName,
              lastname: profile.name.familyName,
              email: profile.emails[0].value
            })
            .then((newUser) => {
              return done(null, newUser);
            });
          }
        })
        .catch((err) => {
          return done(err);
        });
      });
    }
  ));
};