import apiClient from './apiClient';

// TODO make this configurable
const callEndpoint = '/users/:userId/calls';

function userCallEndpoint(userId) {
  return callEndpoint.replace(':userId', userId);
}

export default async function getCallSummary(userId) {
  return apiClient.get(`${userCallEndpoint(userId)}/call-summary`);
}
