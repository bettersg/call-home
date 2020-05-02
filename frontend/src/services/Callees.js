import axios from 'axios';
import * as Sentry from '@sentry/browser';

// TODO make this configurable
const calleeEndpoint = '/callees';

export async function getAllCallees() {
  try {
    const response = await axios.get(`${calleeEndpoint}`);
    return response.data;
  } catch (e) {
    Sentry.captureException(e);
    alert(e.response.data);
    return null;
  }
}

export async function createCallee(callee) {
  try {
    const response = await axios.post(`${calleeEndpoint}`, callee);
    return response.data;
  } catch (e) {
    Sentry.captureException(e);
    alert(e.response.data);
    return null;
  }
}

export async function updateCallee(calleeId, newCallee) {
  try {
    const response = await axios.put(
      `${calleeEndpoint}/${calleeId}`,
      newCallee
    );

    return response.data;
  } catch (e) {
    Sentry.captureException(e);
    alert(e.response.data);
    return null;
  }
}

export async function deleteCallee(calleeId) {
  try {
    const response = await axios.delete(
      `${calleeEndpoint}/${calleeId}`
    );
    return response.data;
  } catch (e) {
    Sentry.captureException(e);
    alert(e.response.data);
    return null;
  }
}
