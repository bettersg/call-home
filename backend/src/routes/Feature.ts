import express, { Router } from 'express';
import { UserInjectedRequest } from './middlewares';
import type { Feature } from '../services';

function FeaturesRoutes(featureService: typeof Feature): Router {
  const router = express.Router();

  router.get('/', async (req: UserInjectedRequest, res) => {
    const userId = req.user.id;
    const features = {
      // TODO Remove this after 11/01/2021
      CALL_LIMITS: true,
      WORKPASS_VALIDATION: featureService.shouldEnableWorkpassValidation(
        userId
      ),
      SHOW_WORKPASS_SCREEN: featureService.shouldEnableWorkpassValidationScreen(
        userId
      ),
    };
    return res.status(200).json(features);
  });

  return router;
}

export default FeaturesRoutes;
