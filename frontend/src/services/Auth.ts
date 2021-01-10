import apiClient from './apiClient';

const phoneNumberEndpoint = '/phone-number-validation';

export async function beginPhoneNumberValidation(
  phoneNumber: string
): Promise<unknown> {
  return apiClient.post(`${phoneNumberEndpoint}/begin`, {
    phoneNumber,
  });
}

export async function login(
  phoneNumber: string,
  code: string
): Promise<unknown> {
  return apiClient.post(`${phoneNumberEndpoint}/login`, {
    phoneNumber,
    code,
  });
}
