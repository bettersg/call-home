import { logger } from '../config';
import { Feature, PhoneNumberValidation, TwilioCall } from '../services';
import refreshConnectedCalls from './refreshConnectedCalls';
import refreshNoPriceCalls from './refreshNoPriceCalls';
import refreshJoinedCalls from './refreshJoinedCalls';
import refreshPhoneNumberStatus from './refreshPhoneNumberStatus';

if (!Feature.shouldDisablePeriodicJobs()) {
  logger.info('Initializing jobs');
  refreshConnectedCalls(TwilioCall);
  refreshNoPriceCalls(TwilioCall);
  refreshPhoneNumberStatus(PhoneNumberValidation);
  refreshJoinedCalls();
} else {
  logger.info('Periodic jobs disabled');
}
