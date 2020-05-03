import apiClient from './apiClient';

// TODO make this configurable
const userEndpoint = '/users';

export const UserTypes = {
  ADMIN: 'ADMIN',
  CALLER: 'CALLER',
};

export async function getSelf() {
  return apiClient.get(`${userEndpoint}/me`);
}

export async function getAllUsers() {
  return apiClient.get(`${userEndpoint}`);
}

export async function getUser(userEmail) {
  return apiClient.get(`${userEndpoint}/${userEmail}`);
}

export async function createUser(user) {
  return apiClient.post(`${userEndpoint}`, user);
}

export async function updateUser(userEmail, newUser) {
  return apiClient.put(`${userEndpoint}/${userEmail}`, newUser);
}

export async function deleteUser(userEmail) {
  return apiClient.delete(`${userEndpoint}/${userEmail}`);
}
