import { shouldEnableSupportServices } from './Feature';

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_APP_SID,
  TWILIO_HEALTHSERVE_ACCOUNT_SID,
  TWILIO_HEALTHSERVE_AUTH_TOKEN,
  TWILIO_HEALTHSERVE_APP_SID,
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_APP_SID) {
  throw Error('Missing twilio environment variables. Aborting...');
}

interface CredentialSet {
  accountSid: string;
  authToken: string;
  appSid: string;
}

const personal: CredentialSet = {
  accountSid: TWILIO_ACCOUNT_SID,
  authToken: TWILIO_AUTH_TOKEN,
  appSid: TWILIO_APP_SID,
};

let healthserve: CredentialSet | null = null;
if (shouldEnableSupportServices()) {
  if (
    !TWILIO_HEALTHSERVE_ACCOUNT_SID ||
    !TWILIO_HEALTHSERVE_AUTH_TOKEN ||
    !TWILIO_HEALTHSERVE_APP_SID
  ) {
    throw Error(
      'Missing twilio healthserve environment variables. Aborting...'
    );
  }

  healthserve = {
    accountSid: TWILIO_HEALTHSERVE_ACCOUNT_SID,
    authToken: TWILIO_HEALTHSERVE_AUTH_TOKEN,
    appSid: TWILIO_HEALTHSERVE_APP_SID,
  };
}

const CredentialSets = {
  personal,
  healthserve,
};

export type { CredentialSet };
export { CredentialSets };
