const session = require('express-session');

module.exports = function PassportConfig(app) {
  // TODO: deeal with this
  const {
    APP_SECRET = 'ac4ff51004dfe5669465c23ad448693f2fabf3a3942bd32916ea5a6753bd2fad',
  } = process.env
  const IS_PROD = process.env.NODE_ENV === 'prod';

  const sessionConfig = {
    cookie: {},
    secret: APP_SECRET,
    resave: false,
    saveUninitialized: true,
  };

  // TODO do this right
  if (IS_PROD) {
    sessionConfig.cookie.secure = true;
    // Uncomment the line below if your application is behind a proxy (like on Heroku)
    // or if you're encountering the error message:
    // "Unable to verify authorization request state"
    // app.set('trust proxy', 1);
  }

  app.use(session(sessionConfig));
}
