import apiClient from './apiClient';

const loginEndpoint = '/passwordless';

export async function beginPasswordless(phoneNumber) {
  return apiClient.post(`${loginEndpoint}/begin`, {
    phoneNumber,
  });
}

export async function login(phoneNumber, code) {
  return apiClient.post(`${loginEndpoint}/login`, {
    phoneNumber,
    code,
  });
}
