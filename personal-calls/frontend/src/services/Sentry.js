import * as Sentry from '@sentry/react';
import axios from 'axios';

const SENTRY_DSN =
  'https://311e61bcb9f24ab7b601e085cce9eb6d@o386666.ingest.sentry.io/5221206';

const SENTRY_ORG_NAME = 'ring-a-senior';
const SENTRY_PROJECT_NAME = 'ring-a-senior-frontend';

const SENTRY_API_CLIENT = axios.create({
  headers: {
    Authorization: `DSN ${SENTRY_DSN}`,
  },
});

export function initSentry() {
  const sentryRelease = window.CALL_HOME.RELEASE_DATE;
  Sentry.init({
    dsn: SENTRY_DSN,
    ignoreErrors: ['Request failed with status code 403', 'Unauthenticated'],
    sendDefaultPii: true,
    integrations: [
      // Disable the default handlers because they are noisy.
      // We capture the information we want via the React error boundary and Twilio event handler
      new Sentry.Integrations.GlobalHandlers({
        onerror: false,
        onunhandledrejection: false,
      }),
    ],
    release: sentryRelease,
  });
  console.log('Initialized Sentry Release', sentryRelease);
}

export function configureUser(user) {
  const { name, emails, userId, id } = user;
  Sentry.configureScope((scope) => {
    console.log('configuring', user);
    scope.setUser({
      userName: userId,
      id,
      name,
      emails: emails || `phoneNumber${user.phoneNumber}@unknown.com`,
    });
  });
}

export async function reportUserIssue(user, issue) {
  const eventId = Sentry.captureMessage('User feedback');
  await SENTRY_API_CLIENT.post(
    `https://sentry.io/api/0/projects/${SENTRY_ORG_NAME}/${SENTRY_PROJECT_NAME}/user-feedback/`,
    {
      event_id: eventId,
      comments: JSON.stringify(issue, null, 2),
      name: user.name,
      email:
        (user.emails && user.emails[0] && user.emails[0].value) ||
        `phoneNumber${user.phoneNumber}@unknown.com`,
    }
  );
}
