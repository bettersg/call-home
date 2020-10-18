import apiClient from './apiClient';

const featureEndpoint = '/features';

async function getFeatures() {
  return apiClient.get(`${featureEndpoint}/`);
}

export { getFeatures };
