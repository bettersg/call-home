import * as Sentry from '@sentry/browser';

const SENTRY_DSN =
  'https://311e61bcb9f24ab7b601e085cce9eb6d@o386666.ingest.sentry.io/5221206';

/* eslint-disable import/prefer-default-export */
export function initSentry() {
  Sentry.init({ dsn: SENTRY_DSN });
}
