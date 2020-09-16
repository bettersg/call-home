import { logger } from '../config';
import { TwilioCall } from '../services';
import refreshConnectedCalls from './refreshConnectedCalls';
// const backfillDuration = require('./backfillDuration');

logger.info('Initializing jobs');

refreshConnectedCalls(TwilioCall);
// backfillDuration(TwilioCall, TwilioClient);
