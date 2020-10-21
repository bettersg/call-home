import express from 'express';
import twilio from 'twilio';

import { logger } from '../config';
import type {
  Call as CallService,
  TwilioCall as TwilioCallService,
} from '../services';
import type { CallStatus } from '../models';

const { VoiceResponse } = twilio.twiml;

const {
  TWILIO_CALL_PHONE_NUMBER,
  NODE_ENV,
  TWILIO_WEBHOOK_BASE_URL,
} = process.env;
const isDev = NODE_ENV === 'development';
logger.info('Running twilio webhook in development mode?', isDev);

const webhookOptions = isDev ? { validate: false } : { validate: true };

interface TwilioActionResponse {
  AccountSid: string;
  ApiVersion: string;
  ApplicationSid: string;
  CallSid: string; // This is the incoming TwiML call SID
  CallStatus: CallStatus;
  Called: string;
  Caller: string;
  DialCallSid: string; // This is the outgoing SID we care about
  DialCallStatus: CallStatus;
  Direction: string;
  From: string;
  To: string;
}

function TwilioRoutes(
  callService: typeof CallService,
  twilioCallService: typeof TwilioCallService
) {
  const router = express.Router();
  router.all('/', (req, _res, next) => {
    req.log.info('recevied twilio request', req.body);
    next();
  });

  // This is strictly for the twilio webhook
  router.all(
    '/twiml',
    twilio.webhook({
      ...webhookOptions,
      url: `${TWILIO_WEBHOOK_BASE_URL}/twiml`,
    }),
    async (req, res) => {
      const {
        userId,
        contactId,
        CallSid: incomingTwilioCallSid,
      } = req.body as {
        userId: string;
        contactId: string;
        CallSid: string;
      };
      req.log.info('creating call for', userId, contactId);

      try {
        const { phoneNumber } = await callService.createCall({
          userId: Number(userId),
          contactId: Number(contactId),
          incomingTwilioCallSid,
        });
        await twilioCallService.createTwilioCall({
          parentCallSid: incomingTwilioCallSid,
        });
        const response = new VoiceResponse().dial(
          {
            callerId: TWILIO_CALL_PHONE_NUMBER,
            // TODO this is hardcoded
            action: '/twilio/voice-status',
          },
          phoneNumber
        );
        return res.send(response.toString());
      } catch (e) {
        if (e.message.startsWith('Authorization')) {
          return res.status(403).send(e.message);
        }
        throw e;
      }
    }
  );

  router.all(
    '/voice-status',
    twilio.webhook({
      ...webhookOptions,
      url: `${TWILIO_WEBHOOK_BASE_URL}/voice-status`,
    }),
    async (req, res) => {
      const twilioResponse: TwilioActionResponse = req.body;
      req.log.info(
        'Got status callback %s',
        JSON.stringify(twilioResponse, null, 2)
      );
      await twilioCallService.fetchTwilioDataForTwilioParentSid(
        twilioResponse.CallSid
      );
      // TODO this gives TwiML errors. Maybe send a hangup response?
      const response = new VoiceResponse();
      response.hangup();
      res.send(response.toString());
    }
  );
  return router;
}

export default TwilioRoutes;
