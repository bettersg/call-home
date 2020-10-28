import express from 'express';
import twilio from 'twilio';
import { ClientCapabilityOptions } from 'twilio/lib/jwt/ClientCapability';
import { logger } from '../config';

const { ClientCapability } = twilio.jwt;

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_APP_SID } = process.env;

// TODO This should only grant tokens for the amount of time needed to establish a connection (~20s)
function CallTokenRoutes(): express.Router {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_APP_SID) {
    const msg = 'Twilio Credentials missing';
    logger.error(msg);
    throw new Error(msg);
  }
  const router = express.Router();

  router.get('/', (req, res) => {
    const capability = new ClientCapability({
      accountSid: TWILIO_ACCOUNT_SID,
      authToken: TWILIO_AUTH_TOKEN,
    } as ClientCapabilityOptions);

    // Add scope to allow Twilio Device to make outgoing calls
    capability.addScope(
      new ClientCapability.OutgoingClientScope({
        applicationSid: TWILIO_APP_SID,
      })
    );

    // Include identity and token in a JSON response
    const token = capability.toJwt();
    res.status(200).send(token);
  });

  return router;
}

export default CallTokenRoutes;
