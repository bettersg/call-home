import apiClient from './apiClient';

// TODO make this configurable
const callEndpoint = '/call-token';

export default async function getToken(): Promise<string> {
  return apiClient.get(`${callEndpoint}`);
}
