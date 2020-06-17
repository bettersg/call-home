const express = require('express');
const twilio = require('twilio');

const { ClientCapability } = twilio.jwt;

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_APP_SID } = process.env;

// TODO This should only grant tokens for the amount of time needed to establish a connection (~20s)
function CallRoutes() {
  const router = express.Router();

  router.get('/token', (req, res) => {
    const capability = new ClientCapability({
      accountSid: TWILIO_ACCOUNT_SID,
      authToken: TWILIO_AUTH_TOKEN,
    });

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

module.exports = CallRoutes;
