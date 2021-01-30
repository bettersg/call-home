import express, { Response, Router } from 'express';
import * as z from 'zod';
import type { FacebookDormCodeRedemption, RedeemableCode } from '../services';
import {
  RedeemableCodeType,
  RedeemableCode as RedeemableCodeEntity,
} from '../models';
import { validateRequest } from './helpers/validation';
import { requireAdmin } from './middlewares';
import { handleServiceError } from './transformers';

const POST_SCHEMA = z.object({
  body: z.object({ code: z.string() }),
});

const FACEBOOK_DORM_CODE_CONFIG = {
  codeType: RedeemableCodeType.FACEBOOK_DORM,
  redemptionLimit: 1,
};

function FacebookDormCodeRedemptionRoutes(
  facebookDormCodeRedemptionService: typeof FacebookDormCodeRedemption,
  redeemableCodeService: typeof RedeemableCode
): Router {
  const router = express.Router();

  router.get(
    '/facebook-dorm/new',
    requireAdmin,
    validateRequest(
      z.object({}),
      async (_parsedReq, res: Response<RedeemableCodeEntity>) => {
        const code = await redeemableCodeService.generateRedeemableCode(
          FACEBOOK_DORM_CODE_CONFIG
        );
        return res.json(code);
      }
    )
  );

  router.post(
    '/facebook-dorm',
    validateRequest(
      POST_SCHEMA,
      async (parsedReq, res: Response<void>, req) => {
        const { code } = parsedReq.body;
        const userId = req.user.id;
        try {
          await facebookDormCodeRedemptionService.redeemCode({
            userId,
            code,
          });
          return res.json();
        } catch (e) {
          return handleServiceError(e, res);
        }
      }
    )
  );

  return router;
}

export default FacebookDormCodeRedemptionRoutes;
