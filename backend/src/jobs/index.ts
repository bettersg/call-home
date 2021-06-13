import { logger } from '../config';
import { Feature, TwilioCall } from '../services';
import refreshConnectedCalls from './refreshConnectedCalls';
import refreshNoPriceCalls from './refreshNoPriceCalls';
import refreshJoinedCalls from './refreshJoinedCalls';

if (!Feature.shouldDisablePeriodicJobs()) {
  logger.info('Initializing jobs');
  refreshConnectedCalls(TwilioCall);
  refreshNoPriceCalls(TwilioCall);
  refreshJoinedCalls();
} else {
  logger.info('Periodic jobs disabled');
}
