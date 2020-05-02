const express = require('express');
const twilio = require('twilio');

const { VoiceResponse } = twilio.twiml;

const { TWILIO_PHONE_NUMBER } = process.env;

function TwilioRoutes(callService) {
  const router = express.Router();

  // This is strictly for the twilio webhook
  // TODO set validate field based on NODE_ENV
  router.post('/', twilio.webhook({ validate: true }), async (req, res) => {
    const { userEmail, calleeId } = req.body;

    try {
      const call = await callService.createCall({ userEmail, calleeId });
      const response = new VoiceResponse()
        .dial({ callerId: TWILIO_PHONE_NUMBER })
        .number(call.phoneNumber);
      return res.send(response.toString());
    } catch (e) {
      if (e.message.startsWith('Authorization')) {
        return res.status(403).send(e.message);
      }
      throw e;
    }
  });

  return router;
}

module.exports = TwilioRoutes;
