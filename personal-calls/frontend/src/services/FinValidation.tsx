import apiClient from './apiClient';

const finEndpoint = '/fin-validation';

export async function validateFin(fin: string) {
  return apiClient.post(`${finEndpoint}/`, {
    fin,
  });
}
