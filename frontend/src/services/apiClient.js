import axios from 'axios';
import * as Sentry from '@sentry/browser';

function handleApiError(wrappedFn) {
  return async (...args) => {
    try {
      const response = await wrappedFn(...args);
      return response.data;
    } catch (e) {
      // We figure out what class of error this is.
      const { response } = e;
      // Worst case, there isn't even a response. Perhaps blocked by CORS. This is unactionable, we just alert and stop.
      if (!response) {
        Sentry.captureException(e);
        throw new Error('An unknown error has occurred.');
      }
      // 401 Means that the user is unauthenticated. This should always be accompanied with a location to redirect to.
      if (response.status === 401 && response.data.location) {
        window.location = response.data.location;
        return undefined;
      }
      // 400 is a bad request, we alert the users somehow but do not report to Sentry.
      if (response.status === 400) {
        // TODO improve the API request handling
        throw new Error(response.data);
      }
      // Alert users and Sentry by default
      Sentry.captureException(e);
      throw new Error(response.data);
    }
  };
}

export default Object.freeze({
  get: handleApiError(axios.get),
  put: handleApiError(axios.put),
  delete: handleApiError(axios.delete),
  post: handleApiError(axios.post),
});
