import { logger } from '../config';
import type { PhoneNumberValidation } from '../services';

// Hourly
const JOB_INTERVAL_MILLIS = 60 * 60 * 1000;

function refreshPhoneNumberStatus(
  phoneNumberValidationService: typeof PhoneNumberValidation
): void {
  async function job(): Promise<void> {
    try {
      logger.info('refreshPhoneNumberStatus==========');
      await phoneNumberValidationService.invalidateExpiredEntries();
    } catch (error) {
      logger.error(error);
    } finally {
      setTimeout(job, JOB_INTERVAL_MILLIS);
    }
  }
  job();
}

export default refreshPhoneNumberStatus;
