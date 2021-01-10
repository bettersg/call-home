import { logger } from '../config';
import { TwilioCall } from '../services';
import refreshConnectedCalls from './refreshConnectedCalls';
import refreshNoPriceCalls from './refreshNoPriceCalls';
import refreshJoinedCalls from './refreshJoinedCalls';

logger.info('Initializing jobs');

refreshConnectedCalls(TwilioCall);
refreshNoPriceCalls(TwilioCall);
refreshJoinedCalls();
