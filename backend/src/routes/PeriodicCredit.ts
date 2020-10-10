import express, { Request, Response } from 'express';

import type { PeriodicCredit } from '../services';

function PeriodicCreditRoutes(periodicCreditService: typeof PeriodicCredit) {
  const router = express.Router();

  router.get('/refresh/next', async (_req: Request, res: Response) => {
    const nextRefreshEpoch = periodicCreditService.getNextUpdateEpoch();
    const nextRefreshAmount = periodicCreditService.getNextUpdateAmount();
    return res.json({
      time: nextRefreshEpoch,
      amount: nextRefreshAmount,
    });
  });

  return router;
}

export default PeriodicCreditRoutes;
