const express = require('express');
require('express-async-errors');
const proxy = require('express-http-proxy');
require('dotenv').config();
const morgan = require('morgan');
const helmet = require('helmet');
const {
  User: userRoutes,
  Contact: contactRoutes,
  Twilio: twilioRoutes,
  Call: callRoutes,
  OAuth: oauthRoutes,
  Passwordless: passwordlessRoutes,
  middlewares: { secureRoutes, httpsRedirect },
} = require('./routes');
const {
  Passport: PassportConfig,
  Session: SessionConfig,
} = require('./config');

const app = express();

// Env vars
const { PORT = 4000, STATIC_DIR = 'static', NODE_ENV } = process.env;
const isProd = NODE_ENV !== 'development';

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Configure sessions with passport. SessionConfig must be applied first
SessionConfig(app);
PassportConfig(app);

if (isProd) {
  app.use(httpsRedirect);
  app.use(helmet());
}
// Make sure oauth is first and NOT secured
app.use('/oauth', oauthRoutes);
app.use('/passwordless', passwordlessRoutes);
// Also ensure that twilio is NOT secured by oauth, just twilio auth
app.use('/twilio', twilioRoutes);
app.use('/users', secureRoutes, userRoutes);
// TODO P1!!! add some kind of auth to allow only modification to self
app.use('/users', secureRoutes, contactRoutes);
app.use('/calls', secureRoutes, callRoutes);
// STATIC_DIR gets populated in a docker build
// expose manifest.json
app.use('/manifest.json', express.static(STATIC_DIR));

if (!isProd) {
  // proxy requests to development frontend
  app.use('/', proxy('http://localhost:3000'));
  // This is just for setting things up
  // require('../setupDemo')().catch(console.error); // eslint-disable-line global-require
} else {
  app.use(express.static(STATIC_DIR));
}

try {
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });
} catch (err) {
  console.error(err);
  throw err;
}
