import express, { Router } from 'express';
import { UserInjectedRequest } from './middlewares';
import type { Feature } from '../services';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FeaturesRoutes(featureService: typeof Feature): Router {
  const router = express.Router();

  router.get('/', async (_req: UserInjectedRequest, res) => {
    // const userId = req.user.id;
    const features = {
      DORM_VALIDATION: featureService.shouldEnableDormValidation(),
      // TODO Remove these after 11/01/2021
      CALL_LIMITS: true,
      WORKPASS_VALIDATION: true,
      SHOW_WORKPASS_SCREEN: true,
    };
    return res.status(200).json(features);
  });

  return router;
}

export default FeaturesRoutes;
