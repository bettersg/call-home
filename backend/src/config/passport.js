const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

// Configure passport after configuring sessions
module.exports = function PassportConfig(app) {
  const {
    AUTH0_CALLBACK_URL,
    AUTH0_DOMAIN,
    AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET,
  } = process.env

  const strategy = new Auth0Strategy(
    {
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      callbackURL: AUTH0_CALLBACK_URL,
    },
    (_accessToken, _refreshToken, _extraParams, profile, done) => {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      console.log('Passport', profile)
      return done(null, profile);
    }
  );

  passport.use(strategy);
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());
}
