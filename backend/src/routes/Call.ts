import express from 'express';
import { requireSelf } from './middlewares';
import type {
  Call as CallService,
  TwilioCall as TwilioCallService,
} from '../services';
import Stopwatch from '../util/stopwatch';

function CallRoutes(
  callService: typeof CallService,
  twilioCallService: typeof TwilioCallService
) {
  const router = express.Router();

  router.get('/:userId/calls/call-summary', requireSelf, async (req, res) => {
    const { userId } = req.params;
    const stopwatch = new Stopwatch();
    stopwatch.start();
    const userCalls = await callService.getUserCallsForPeriod(Number(userId));
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
  });

  return router;
}

export default CallRoutes;
