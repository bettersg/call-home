import express, { Router } from 'express';
import * as z from 'zod';
import { requireSelf } from './middlewares';
import type {
  Call as CallService,
  TwilioCall as TwilioCallService,
} from '../services';
import Stopwatch from '../util/stopwatch';
import { logger } from '../config';
import { stringToNumberTransformer } from './helpers/validation';

function CallRoutes(
  callService: typeof CallService,
  twilioCallService: typeof TwilioCallService
): Router {
  const router = express.Router();

  router.get('/:userId/calls/call-summary', requireSelf, async (req, res) => {
    let validatedReq;
    try {
      const paramsSchema = z.object({
        userId: stringToNumberTransformer,
      });
      const params = paramsSchema.parse(req.params);
      validatedReq = { params };
    } catch (error) {
      logger.error(error);
      return res.status(400).send(error);
    }

    const { userId } = validatedReq.params;
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
    return res.send(String(totalDurationSeconds));
  });

  return router;
}

export default CallRoutes;
