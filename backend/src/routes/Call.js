const express = require('express');
const twilio = require('twilio');
const { ClientCapability } = twilio.jwt;
const { VoiceResponse } = twilio.twiml;

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_APP_SID, TWILIO_PHONE_NUMBER } = process.env;

// TODO this is a weird mishmash of calls and twilio stuff. should clean this up
function CallRoutes() {
  const router = express.Router()

  router.get('/token', (req, res) => {
    const capability = new ClientCapability({
      accountSid: TWILIO_ACCOUNT_SID,
      authToken: TWILIO_AUTH_TOKEN,
    });

    // Add scope to allow Twilio Device to make outgoing calls
    capability.addScope(
      new ClientCapability.OutgoingClientScope({applicationSid: TWILIO_APP_SID})
    );

    // Include identity and token in a JSON response
    return capability.toJwt();

    res.status(200).send(token);
  });

  router.post('/', twilio.webhook({validate: false}), async (req, res) => {
    const { targetNumber } = req.body;
    const response = new VoiceResponse()
      .dial({ callerId: TWILIO_PHONE_NUMBER })
      .number(targetNumber);
    res.send(response.toString());
  })

  return router;
}

module.exports = CallRoutes;
