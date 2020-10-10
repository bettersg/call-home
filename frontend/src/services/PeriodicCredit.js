import apiClient from './apiClient';

const periodicCreditEndpoint = '/periodic-credit';

async function getNextRefresh() {
  const { time, amount } = await apiClient.get(
    `${periodicCreditEndpoint}/refresh/next`
  );
  return { time, amount };
}

export { getNextRefresh };
