import express, { Router } from 'express';
import { UserInjectedRequest } from './middlewares';
import type { Feature, UserExperimentConfig } from '../services';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FeaturesRoutes(
  featureService: typeof Feature,
  userExperimentConfigService: typeof UserExperimentConfig
): Router {
  const router = express.Router();

  router.get('/', async (req: UserInjectedRequest, res) => {
    const userId = req.user.id;
    const userExperimentConfig = await userExperimentConfigService.getOrUpsert(
      userId
    );

    const features = {
      DORM_VALIDATION: featureService.shouldEnableDormValidation(),
      EDGE_EXPERIMENT:
        featureService.getEdgeExperimentFlag(userExperimentConfig),
      FEEDBACK_DIALOG: featureService.shouldEnableFeedbackDialog(),
      CREDIT_CAP: featureService.shouldEnableCreditCap(),
    };
    return res.status(200).json(features);
  });

  return router;
}

export default FeaturesRoutes;
