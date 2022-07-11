import express from 'express';
import twilio from 'twilio';
import { ClientCapabilityOptions } from 'twilio/lib/jwt/ClientCapability';
import type { CredentialSet, CredentialSets, Feature } from '../services';

const { ClientCapability } = twilio.jwt;

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
function CallTokenRoutes(
  featureService: typeof Feature,
  credentialSets: typeof CredentialSets
): express.Router {
  const router = express.Router();

  if (!credentialSets.personal) {
    throw new Error('BUG! No twilio credentials found');
  }

  if (
    featureService.shouldEnableSupportServices() &&
    credentialSets.healthserve
  ) {
    router.get('/healthserve', (_req, res) => {
      const token = generateToken(credentialSets.healthserve as CredentialSet);
      res.status(200).send(token);
    });
  }

  router.get('/', (_req, res) => {
    const token = generateToken(credentialSets.personal);
    res.status(200).send(token);
  });

  return router;
}

export default CallTokenRoutes;
