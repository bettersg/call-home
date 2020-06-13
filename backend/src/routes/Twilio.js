const express = require('express');
const twilio = require('twilio');

const { VoiceResponse } = twilio.twiml;

const { TWILIO_PHONE_NUMBER, NODE_ENV, TWILIO_WEBHOOK_URL } = process.env;
const isProd = NODE_ENV !== 'development';
console.log('Running twilio webhook in production mode?', isProd);

const webhookOptions = isProd
  ? { validate: true, url: TWILIO_WEBHOOK_URL }
  : { validate: false };

function TwilioRoutes(callService) {
  const router = express.Router();

  // This is strictly for the twilio webhook
  // TODO set validate field based on NODE_ENV
  router.all(
    '/',
    (req, res, next) => {
      console.log('recevied twilio request', req.body);
      next();
    },
    twilio.webhook(webhookOptions),
    async (req, res) => {
      const {
        userId,
        contactId,
        CallSid: twilioCallId,
        CallStatus: twilioCallStatus,
      } = req.body;
      console.log('creating call for', userId, contactId);

      try {
        const { phoneNumber } = await callService.createCall({
          userId: Number(userId),
          contactId: Number(contactId),
          twilioCallId,
          twilioCallStatus,
        });
        const response = new VoiceResponse()
          .dial({ callerId: TWILIO_PHONE_NUMBER })
          .number(phoneNumber);
        return res.send(response.toString());
      } catch (e) {
        if (e.message.startsWith('Authorization')) {
          return res.status(403).send(e.message);
        }
        throw e;
      }
    }
  );

  return router;
}

module.exports = TwilioRoutes;
