const session = require('express-session');
const SessionStore = require('express-session-sequelize')(session.Store);
const { sequelize } = require('../models');

const IS_PROD = process.env.NODE_ENV === 'production';

module.exports = function PassportConfig(app) {
  const { APP_SECRET } = process.env;
  const sessionConfig = {
    cookie: {},
    secret: APP_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new SessionStore({
      db: sequelize,
    }),
  };

  if (IS_PROD) {
    sessionConfig.cookie.secure = true;
    // Uncomment the line below if your application is behind a proxy (like on Heroku)
    // or if you're encountering the error message:
    // "Unable to verify authorization request state"
    app.set('trust proxy', 1);
  }

  app.use(session(sessionConfig));
};
