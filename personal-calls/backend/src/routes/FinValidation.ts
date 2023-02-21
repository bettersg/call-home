import express, { Router } from 'express';
import * as z from 'zod';
import type { FinValidation } from '../services';
import { validateRequest } from './helpers/validation';

const POST_SCHEMA = z.object({
  body: z.object({
    fin: z.string(),
  }),
});

function FinValidationRoutes(finValidation: typeof FinValidation): Router {
  const router = express.Router();

  router.post(
    '/',
    validateRequest(POST_SCHEMA, async (parsedReq, res, req) => {
      const { fin } = parsedReq.body;
      const { user } = req;

      const validationResult = await finValidation.validateUser(user.id, fin);

      if (validationResult === 'VALID') {
        return res.status(200).send();
      }

      return res.status(400).json({
        reason: validationResult
      });
    })
  );

  return router;
}

export default FinValidationRoutes;
