const express = require('express');
require('express-async-errors');
const proxy = require('express-http-proxy');
require('dotenv').config();
const morgan = require('morgan');
const helmet = require('helmet');
const {
  User: userRoutes,
  Callee: calleeRoutes,
  Twilio: twilioRoutes,
  Call: callRoutes,
  OAuth: oauthRoutes,
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
// Also ensure that twilio is NOT secured by oauth, just twilio auth
app.use('/twilio', twilioRoutes);
app.use('/users', secureRoutes, userRoutes);
app.use('/callees', secureRoutes, calleeRoutes);
app.use('/calls', secureRoutes, callRoutes);
// STATIC_DIR gets populated in a docker build
// expose manifest.json
app.use('/manifest.json', express.static(STATIC_DIR));

if (!isProd) {
  // proxy requests to development frontend
  app.use('/', secureRoutes, proxy('http://localhost:3000'));
  // This is just for setting things up
  // require('../setupDemo')().catch(console.error); // eslint-disable-line global-require
} else {
  app.use(secureRoutes, express.static(STATIC_DIR));
}

try {
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });
} catch (err) {
  console.error(err);
  throw err;
}
