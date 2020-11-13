import { logger } from '../config';
import { TwilioCall, User, PhoneNumberValidation } from '../services';
import refreshConnectedCalls from './refreshConnectedCalls';
import refreshJoinedCalls from './refreshJoinedCalls';
import backfillPhoneNumberValidation from './backfillPhoneNumberValidation';

logger.info('Initializing jobs');

refreshConnectedCalls(TwilioCall);
refreshJoinedCalls();
backfillPhoneNumberValidation(User, PhoneNumberValidation);
