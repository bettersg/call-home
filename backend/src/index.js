const express = require('express');
const proxy = require('express-http-proxy');
require('dotenv').config();
const morgan = require('morgan');
const {
  User: userRoutes,
  Call: callRoutes,
  OAuth: oauthRoutes,
} = require('./routes');
const {
  Passport: PassportConfig,
  Session: SessionConfig,
} = require('./config');

const app = express();

// Env vars
const { PORT = 3000, STATIC_DIR = 'static' } = process.env;

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Configure sessions with passport. SessionConfig must be applied first
SessionConfig(app);
PassportConfig(app)

// This gets populated in a docker build
app.use(express.static(STATIC_DIR));
app.use('/users', userRoutes);
app.use('/twilio', callRoutes);
app.use('/oauth', oauthRoutes);

// TODO proxy requests to development frontend
app.use('/', (req, res, next) => {
  next();
}, proxy('http://localhost:3000'));

try {
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });

  // TODO this is just for setting things up
  require('../setupDemo')()
    .catch(console.error);
} catch (err) {
  console.error(err);
  throw err;
}
