const path = require('path');
const express = require('express');
require('express-async-errors');
const proxy = require('express-http-proxy');
require('dotenv').config();
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('pino')();
const pinoHttp = require('pino-http');
const {
  AllowlistEntry: allowlistRoutes,
  User: userRoutes,
  Contact: contactRoutes,
  Twilio: twilioRoutes,
  Call: callRoutes,
  OAuth: oauthRoutes,
  Passwordless: passwordlessRoutes,
  middlewares: { secureRoutes, httpsRedirect, requireVerified },
} = require('./routes');
const {
  Passport: PassportConfig,
  Session: SessionConfig,
} = require('./config');
require('./jobs');

const app = express();

// Env vars
const { PORT = 4000, STATIC_DIR = 'static', NODE_ENV } = process.env;
const isProd = NODE_ENV !== 'development';

app.use(morgan('dev'));
app.use(pinoHttp());
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
app.use('/passwordless', secureRoutes, passwordlessRoutes);
// Also ensure that twilio is NOT secured by oauth, just twilio auth
app.use('/twilio', twilioRoutes);
app.use('/users', secureRoutes, userRoutes);
// TODO P1!!! add some kind of auth to allow only modification to self
app.use('/users', secureRoutes, requireVerified, contactRoutes);
app.use('/calls', secureRoutes, requireVerified, callRoutes);
app.use('/allowlistEntries', secureRoutes, allowlistRoutes);

if (!isProd) {
  // proxy requests to development frontend
  app.use('/', proxy('http://localhost:3000'));
} else {
  // STATIC_DIR gets populated in a docker build
  app.use(express.static(STATIC_DIR));
}

// Redirect everything else to index.html
app.use((req, res) => {
  res.sendfile(path.join(STATIC_DIR, 'index.html'));
});

try {
  app.listen(PORT, () => {
    logger.info(`Example app listening on port ${PORT}!`);
  });
} catch (err) {
  logger.error(err);
  throw err;
}
