import apiClient from './apiClient';

const dormEndpoint = '/dorm-validations';

export async function validateDorm(dormId: number | null) {
  return apiClient.post(`${dormEndpoint}/`, {
    dormId,
  });
}
