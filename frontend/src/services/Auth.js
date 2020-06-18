import apiClient from './apiClient';

const passwordlessEndpoint = '/passwordless';

export async function beginPasswordless(phoneNumber) {
  return apiClient.post(`${passwordlessEndpoint}/begin`, {
    phoneNumber,
  });
}

export async function login(phoneNumber, code) {
  return apiClient.post(`${passwordlessEndpoint}/login`, {
    phoneNumber,
    code,
  });
}
