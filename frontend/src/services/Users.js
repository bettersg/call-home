import axios from 'axios';
import * as Sentry from '@sentry/browser';

// TODO make this configurable
const userEndpoint = '/users';

export const UserTypes = {
  ADMIN: 'ADMIN',
  CALLER: 'CALLER',
};

// TODO report all request errors

export async function getSelf() {
  try {
    const response = await axios.get(`${userEndpoint}/me`);
    return response.data;
  } catch (e) {
    Sentry.captureException(e);
    alert(e.response.data);
    return null;
  }
}

export async function getAllUsers() {
  try {
    const response = await axios.get(`${userEndpoint}`);
    return response.data;
  } catch (e) {
    Sentry.captureException(e);
    alert(e.response.data);
    return null;
  }
}

export async function getUser(userEmail) {
  try {
    const response = await axios.get(`${userEndpoint}/${userEmail}`);
    return response.data;
  } catch (e) {
    Sentry.captureException(e);
    alert(e.response.data);
    return null;
  }
}

export async function createUser(user) {
  try {
    const response = await axios.post(`${userEndpoint}`, user);
    return response.data;
  } catch (e) {
    Sentry.captureException(e);
    alert(e.response.data);
    return null;
  }
}

export async function updateUser(userEmail, newUser) {
  try {
    const response = await axios.put(`${userEndpoint}/${userEmail}`, newUser);

    return response.data;
  } catch (e) {
    Sentry.captureException(e);
    alert(e.response.data);
    return null;
  }
}

export async function deleteUser(userEmail) {
  try {
    const response = await axios.delete(`${userEndpoint}/${userEmail}`);
    return response.data;
  } catch (e) {
    Sentry.captureException(e);
    alert(e.response.data);
    return null;
  }
}
