import apiClient from './apiClient';

const phoneNumberEndpoint = '/phone-number-validation';

export async function beginPhoneNumberValidation(phoneNumber) {
  return apiClient.post(`${phoneNumberEndpoint}/begin`, {
    phoneNumber,
  });
}

export async function login(phoneNumber, code) {
  return apiClient.post(`${phoneNumberEndpoint}/login`, {
    phoneNumber,
    code,
  });
}
