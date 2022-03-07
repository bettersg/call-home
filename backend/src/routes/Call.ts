import express, { Router } from 'express';
import * as z from 'zod';
import { requireSelf } from './middlewares';
import type {
  Call as CallService,
  TwilioCall as TwilioCallService,
  Contact as ContactService,
} from '../services';
import Stopwatch from '../util/stopwatch';
import {
  validateRequest,
  stringToNumberTransformer,
} from './helpers/validation';
import { Call, Contact } from '../models';
import TwilioCall from '../models/TwilioCall';

const GET_SCHEMA = z.object({
  params: z.object({
    userId: stringToNumberTransformer,
  }),
});

const GET_RECENT_SCHEMA = z.object({
  params: z.object({
    userId: stringToNumberTransformer,
  }),
});

const POST_FEEDBACK_SCHEMA = z.object({
  params: z.object({
    userId: stringToNumberTransformer,
    twilioParentSid: z.string(),
  }),
  body: z.object({
    avgMos: z.optional(z.number()),
    qualityScore: z.number(),
    qualityIssue: z.optional(z.string()),
  }),
});

function mapObjectsToRecentCallResponse(
  calls: Call[],
  contacts: Contact[],
  twilioCalls: TwilioCall[]
) {
  const callsData = calls.map((call) => {
    const currentContact = contacts.find(
      (contact) => contact.id === call.contactId
    );
    const currentTwilioCall = twilioCalls.find((twilioCall) => {
      return (
        twilioCall.parentCallSid === call.incomingTwilioCallSid &&
        twilioCall.status === 'completed'
      );
    });
    if (!currentTwilioCall) {
      return null;
    }
    return {
      id: call.id,
      avatar: (currentContact && currentContact.avatar) || null,
      name: (currentContact && currentContact.name) || null,
      phoneNumber: call.phoneNumber,
      startTime: call.createdAt.toISOString(),
      duration: (currentTwilioCall && currentTwilioCall.duration) || null,
    };
  });
  return callsData.filter((data) => data);
}

function CallRoutes(
  callService: typeof CallService,
  twilioCallService: typeof TwilioCallService,
  contactService: typeof ContactService
): Router {
  const router = express.Router();

  router.get(
    '/:userId/calls/recent',
    requireSelf,
    validateRequest(GET_RECENT_SCHEMA, async (parsedReq, res) => {
      const { userId } = parsedReq.params;
      const recentCalls = await callService.listRecentCallsByUserId(userId);
      const allContactIds = recentCalls.map((call) => call.contactId);
      const uniqueContactIds = [...new Set(allContactIds)];
      const contacts = <Contact[]>(
        await contactService.listContactsFromIds(uniqueContactIds)
      );
      const twilioCallSids = recentCalls.map(
        (call) => call.incomingTwilioCallSid
      );
      const twilioCalls = await twilioCallService.listTwilioCallsByParentSids(
        twilioCallSids
      );

      return res
        .status(200)
        .json(
          mapObjectsToRecentCallResponse(recentCalls, contacts, twilioCalls)
        );
    })
  );

  router.get(
    '/:userId/calls/call-summary',
    requireSelf,
    validateRequest(GET_SCHEMA, async (parsedReq, res, req) => {
      const { userId } = parsedReq.params;
      const stopwatch = new Stopwatch();
      stopwatch.start();
      const userCalls = await callService.getUserCallsForPeriod(userId);
      const twilioCalls = await Promise.all(
        userCalls.map((call) =>
          twilioCallService.getTwilioCallByParentSid(call.incomingTwilioCallSid)
        )
      );
      const totalDurationSeconds = twilioCalls
        .map((twilioCall) => {
          if (!twilioCall) {
            return 0;
          }
          return twilioCall.duration;
        })
        .reduce((acc, curr) => acc + curr, 0);
      stopwatch.stop();
      req.log.info(
        'Calculating summary for user %s took %s millis',
        userId,
        stopwatch.millisTaken
      );
      res.send(String(totalDurationSeconds));
    })
  );

  router.post(
    '/:userId/calls/:twilioParentSid/feedback',
    requireSelf,
    validateRequest(POST_FEEDBACK_SCHEMA, async (parsedReq, res, req) => {
      const { userId, twilioParentSid } = parsedReq.params;
      const { qualityScore, qualityIssue, avgMos } = parsedReq.body;
      const feedback = await twilioCallService.postCallFeedback(
        twilioParentSid,
        avgMos,
        qualityScore,
        qualityIssue
      );
      res.json(feedback);
    })
  );

  return router;
}

export default CallRoutes;
