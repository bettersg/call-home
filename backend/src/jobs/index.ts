import { logger } from '../config';
import { TwilioCall, TwilioClient } from '../services';
import refreshConnectedCalls from './refreshConnectedCalls';
// const backfillDuration = require('./backfillDuration');

logger.info('Initializing jobs');

refreshConnectedCalls(TwilioCall, TwilioClient);
// backfillDuration(TwilioCall, TwilioClient);
