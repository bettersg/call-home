import { DateTime, Duration } from 'luxon';
import apiClient from './apiClient';

const periodicCreditEndpoint = '/periodic-credit';

async function getNextRefresh() {
  const data = (await apiClient.get(
    `${periodicCreditEndpoint}/refresh/next`
  )) as any;
  return {
    time: DateTime.fromISO(data.timeAsIso),
    amount: Duration.fromObject({ minutes: data.amountAsMinutes }),
  };
}

export { getNextRefresh };
