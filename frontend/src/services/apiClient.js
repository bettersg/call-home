/* eslint-disable max-classes-per-file */
import axios from 'axios';
import * as Sentry from '@sentry/browser';

export class UnauthenticatedError extends Error {}

export class ApiDataError extends Error {
  constructor(apiData) {
    super();
    this.data = apiData;
  }
}

export class ApiValidationError extends Error {
  constructor(message) {
    super();
    this.code = message.replace(ApiValidationError.validationErrorPrefix, '');
  }

  static validationErrorPrefix = 'Validation Error: ';

  static isValidationErrorMessage(message) {
    return message.startsWith(ApiValidationError.validationErrorPrefix);
  }
}

function handleApiError(wrappedFn, { preventRedirect } = {}) {
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
        if (preventRedirect) {
          throw new UnauthenticatedError('Unauthenticated');
        } else {
          window.location = response.data.location;
          return undefined;
        }
      }

      // 400 is a bad request, we alert the users somehow but do not report to Sentry.
      if (response.status === 400) {
        // TODO improve the API request handling
        if (
          typeof response.data === 'string' &&
          ApiValidationError.isValidationErrorMessage(response.data)
        ) {
          throw new ApiValidationError(response.data);
        }
        throw new ApiDataError(response.data);
      }
      // Alert users and Sentry by default
      Sentry.captureException(e);
      throw new ApiDataError(response.data);
    }
  };
}

export default Object.freeze({
  get: handleApiError(axios.get),
  put: handleApiError(axios.put),
  delete: handleApiError(axios.delete),
  post: handleApiError(axios.post),
});

// Expose a version that doesn't automatically redirect in case the caller needs to make use of the unauthenticated status.
export const noRedirectClient = Object.freeze({
  get: handleApiError(axios.get, { preventRedirect: true }),
  put: handleApiError(axios.put, { preventRedirect: true }),
  delete: handleApiError(axios.delete, { preventRedirect: true }),
  post: handleApiError(axios.post, { preventRedirect: true }),
});
