import express, { Request, Response } from 'express';

import type { PeriodicCredit } from '../services';

function PeriodicCreditRoutes(periodicCreditService: typeof PeriodicCredit) {
  const router = express.Router();

  router.get('/refresh-time/next', async (_req: Request, res: Response) => {
    const nextRefreshEpoch = periodicCreditService.getNextUpdateEpoch();
    return res.json({ time: nextRefreshEpoch });
  });

  return router;
}

export default PeriodicCreditRoutes;
