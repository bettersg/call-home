import express, { Response, Router } from 'express';

import type { PeriodicCredit } from '../services';
import type { UserInjectedRequest } from './middlewares';

function PeriodicCreditRoutes(
  periodicCreditService: typeof PeriodicCredit
): Router {
  const router = express.Router();

  router.get(
    '/refresh/next',
    async (req: UserInjectedRequest, res: Response) => {
      const userId = Number(req.user.id);
      const nextRefreshInfo = await periodicCreditService.getNextUpdateInfo(
        userId
      );
      return res.json(nextRefreshInfo);
    }
  );

  return router;
}

export default PeriodicCreditRoutes;
