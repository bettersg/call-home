const logger = require('pino')();
const services = require('../services');
const refreshConnectedCalls = require('./refreshConnectedCalls');
const backfillDuration = require('./backfillDuration');

const { TwilioCall, TwilioClient } = services;

logger.info('Initializing jobs');

refreshConnectedCalls(TwilioCall, TwilioClient);
backfillDuration(TwilioCall, TwilioClient);
