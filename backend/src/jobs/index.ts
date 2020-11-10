import { logger } from '../config';
import { TwilioCall, User, ValidationState } from '../services';
import refreshConnectedCalls from './refreshConnectedCalls';
import refreshJoinedCalls from './refreshJoinedCalls';
import backfillValidationStates from './backfillValidationStates';

logger.info('Initializing jobs');

refreshConnectedCalls(TwilioCall);
refreshJoinedCalls();
backfillValidationStates(User, ValidationState);
