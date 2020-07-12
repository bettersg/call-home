import * as Sentry from '@sentry/browser';
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
  Sentry.init({ dsn: SENTRY_DSN });
}

export function configureUser(user) {
  const { name, emails, userId, id } = user;
  Sentry.configureScope((scope) => {
    console.log('configuring', user);
    scope.setUser({
      userName: userId,
      id,
      name,
      emails,
    });
  });
}

export async function reportUserIssue({ userName, userEmail, userComments }) {
  const eventId = Sentry.captureMessage('User feedback');
  const result = await SENTRY_API_CLIENT.post(
    `https://sentry.io/api/0/projects/${SENTRY_ORG_NAME}/${SENTRY_PROJECT_NAME}/user-feedback/`,
    {
      event_id: eventId,
      name: userName,
      email: userEmail,
      comments: userComments,
    }
  );
  console.log(result);
}
