import apiClient from './apiClient';

// TODO make this configurable
const callEndpoint = '/calls';

export default async function getToken() {
  return apiClient.get(`${callEndpoint}/token`);
}
