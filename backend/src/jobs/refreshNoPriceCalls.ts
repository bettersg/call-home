import { logger } from '../config';
import type { TwilioCall } from '../services';

const jobIntervalMillis = 20000;

// call duration only seems to update at the END of the call. This means that we need some other way of tracking in-progress calls?

function refreshNoPriceCalls(twilioCallService: typeof TwilioCall): void {
  async function job() {
    try {
      logger.info('refreshNoPriceCalls==========');
      await twilioCallService.fetchTwilioDataForCompletedNoPriceTwilioCalls();
    } catch (error) {
      logger.error(error);
    } finally {
      setTimeout(job, jobIntervalMillis);
    }
  }
  job();
}

export default refreshNoPriceCalls;
