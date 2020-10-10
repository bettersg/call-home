import apiClient from './apiClient';

const periodicCreditEndpoint = '/periodic-credit';

async function getNextRefreshTime() {
  const { time } = await apiClient.get(
    `${periodicCreditEndpoint}/refresh-time/next`
  );
  return time;
}

export { getNextRefreshTime };
