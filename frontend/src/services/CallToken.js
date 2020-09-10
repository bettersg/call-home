import apiClient from './apiClient';

// TODO make this configurable
const callEndpoint = '/call-token';

export default async function getToken() {
  return apiClient.get(`${callEndpoint}`);
}
