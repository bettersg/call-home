import dotenv from 'dotenv';

import path from 'path';
import express, { Request, Response } from 'express';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import 'express-async-errors';

import {
  AllowlistEntry as allowlistRoutes,
  Call as callRoutes,
  CallToken as callTokenRoutes,
  User as userRoutes,
  Contact as contactRoutes,
  Twilio as twilioRoutes,
  OAuth as oauthRoutes,
  Passwordless as passwordlessRoutes,
  Transaction as transactionRoutes,
  Feature as featureRoutes,
  PeriodicCredit as periodicCreditRoutes,
  middlewares,
} from './routes';
import {
  Passport as PassportConfig,
  Session as SessionConfig,
  logger,
  httpPinoConfig,
} from './config';
// TODO This keeps relocating after each precommit, this should be ignored somehow
// eslint-disable-next-line
dotenv.config();

require('./jobs');

const { secureRoutes, httpsRedirect, requireVerified } = middlewares;

const app = express();

type env = 'development' | 'production' | 'staging';

// Env vars
const { NODE_ENV } = process.env as { NODE_ENV: env };
const { PORT = 4000, STATIC_DIR = 'static' } = process.env;

app.use(morgan('dev'));
app.use(pinoHttp(httpPinoConfig));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Configure sessions with passport. SessionConfig must be applied first
SessionConfig(app);
PassportConfig(app);

// TODO This is not great
if (NODE_ENV === 'production' || NODE_ENV === 'staging') {
  app.use(httpsRedirect);
  app.use(helmet());
}

// Make sure oauth is first and NOT secured
app.use('/oauth', oauthRoutes);
// We'll also show the periodic credit stuff
app.use('/periodic-credit', periodicCreditRoutes);

// TODO Features are a bit weird because we have per-user config. We probably want features for non logged in users too. Should probably use a different middleware for this
app.use('/features', secureRoutes, featureRoutes);
app.use('/passwordless', secureRoutes, passwordlessRoutes);
// Also ensure that twilio is NOT secured by oauth, just twilio auth
app.use('/twilio', twilioRoutes);
app.use('/call-token', secureRoutes, requireVerified, callTokenRoutes);
app.use('/users', secureRoutes, userRoutes);
app.use('/users', secureRoutes, requireVerified, contactRoutes);
app.use('/users', secureRoutes, requireVerified, callRoutes);
app.use('/users', secureRoutes, requireVerified, transactionRoutes);
app.use('/allowlistEntries', secureRoutes, allowlistRoutes);

if (NODE_ENV === 'development') {
  // proxy requests to development frontend
  app.use('/', proxy('http://localhost:3000'));
} else {
  // STATIC_DIR gets populated in a docker build
  app.use(express.static(STATIC_DIR));
}

// Redirect everything else to index.html
app.use((_req: Request, res: Response) => {
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
