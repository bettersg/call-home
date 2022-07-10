import express from 'express';
import twilio from 'twilio';
import { ClientCapabilityOptions } from 'twilio/lib/jwt/ClientCapability';
import type { Feature } from '../services';
import { logger } from '../config';

const { ClientCapability } = twilio.jwt;

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_APP_SID,
  TWILIO_HEALTHSERVE_ACCOUNT_SID,
  TWILIO_HEALTHSERVE_AUTH_TOKEN,
  TWILIO_HEALTHSERVE_APP_SID,
} = process.env;

interface CredentialSet {
  accountSid: string;
  authToken: string;
  appSid: string;
}

type CredentialSetName = 'personal' | 'healthserve';

function generateToken(credentialSet: CredentialSet) {
  const capability = new ClientCapability({
    accountSid: credentialSet.accountSid,
    authToken: credentialSet.authToken,
  } as ClientCapabilityOptions);

  // Add scope to allow Twilio Device to make outgoing calls
  capability.addScope(
    new ClientCapability.OutgoingClientScope({
      applicationSid: credentialSet.appSid,
    })
  );

  // Include identity and token in a JSON response
  return capability.toJwt();
}

// TODO This should only grant tokens for the amount of time needed to establish a connection (~20s)
function CallTokenRoutes(featureService: typeof Feature): express.Router {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_APP_SID) {
    throw Error('Missing twilio environment variables. Aborting...');
  }

  const personalCredentialSet = {
    accountSid: TWILIO_ACCOUNT_SID,
    authToken: TWILIO_AUTH_TOKEN,
    appSid: TWILIO_APP_SID,
  };

  const router = express.Router();

  if (featureService.shouldEnableSupportServices()) {
    if (
      !TWILIO_HEALTHSERVE_ACCOUNT_SID ||
      !TWILIO_HEALTHSERVE_AUTH_TOKEN ||
      !TWILIO_HEALTHSERVE_APP_SID
    ) {
      throw Error(
        'Missing twilio healthserve environment variables. Aborting...'
      );
    }

    const healthserveCredentialSet = {
      accountSid: TWILIO_HEALTHSERVE_ACCOUNT_SID,
      authToken: TWILIO_HEALTHSERVE_AUTH_TOKEN,
      appSid: TWILIO_HEALTHSERVE_APP_SID,
    };
    router.get('/healthserve', (_req, res) => {
      const token = generateToken(healthserveCredentialSet);
      res.status(200).send(token);
    });
  }

  router.get('/', (_req, res) => {
    const token = generateToken(personalCredentialSet);
    res.status(200).send(token);
  });

  return router;
}

export default CallTokenRoutes;
