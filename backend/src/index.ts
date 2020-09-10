import path from 'path';
import express, { Request, Response } from 'express';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';
import 'express-async-errors';
import pino from 'pino';

import {
  AllowlistEntry as allowlistRoutes,
  Call as callRoutes,
  CallToken as callTokenRoutes,
  User as userRoutes,
  Contact as contactRoutes,
  Twilio as twilioRoutes,
  OAuth as oauthRoutes,
  Passwordless as passwordlessRoutes,
  middlewares,
} from './routes';
import config = require('./config');

require('./jobs');

const { Passport: PassportConfig, Session: SessionConfig } = config;
const logger = pino();

dotenv.config();

const { secureRoutes, httpsRedirect, requireVerified } = middlewares;

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
app.use('/call-token', secureRoutes, requireVerified, callTokenRoutes);
app.use('/users', secureRoutes, userRoutes);
app.use('/users', secureRoutes, requireVerified, contactRoutes);
app.use('/users', secureRoutes, requireVerified, callRoutes);
app.use('/allowlistEntries', secureRoutes, allowlistRoutes);

if (!isProd) {
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
