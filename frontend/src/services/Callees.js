import apiClient from './apiClient';

// TODO make this configurable
const calleeEndpoint = '/callees';

export async function getAllCallees() {
  return apiClient.get(`${calleeEndpoint}`);
}

export async function createCallee(callee) {
  return apiClient.post(`${calleeEndpoint}`, callee);
}

export async function updateCallee(calleeId, newCallee) {
  return apiClient.put(`${calleeEndpoint}/${calleeId}`, newCallee);
}

export async function deleteCallee(calleeId) {
  return apiClient.delete(`${calleeEndpoint}/${calleeId}`);
}
