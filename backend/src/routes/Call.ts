import express from 'express';
import { requireSelf } from './middlewares';

function CallRoutes(callService: any) {
  const router = express.Router();

  router.get('/:userId/call-summary', requireSelf, async (req, res) => {
    const { userId } = req.params;
    const callSummary = await callService.getUserCallsForPeriod(userId);
    res.send(callSummary);
  });

  return router;
}

export default CallRoutes;
