import express, { Router } from 'express';
import * as z from 'zod';
import type { DormValidation } from '../services';
import { validateRequest } from './helpers/validation';

const POST_SCHEMA = z.object({
  body: z.object({
    dormId: z.number().nullable().optional(),
  }),
});

function DormValidationRoutes(dormValidation: typeof DormValidation): Router {
  const router = express.Router();

  router.post(
    '/',
    validateRequest(POST_SCHEMA, async (parsedReq, res, req) => {
      const { dormId } = parsedReq.body;
      const { user } = req;

      await dormValidation.validateUser(user.id, dormId);

      return res.status(200).send();
    })
  );

  return router;
}

export default DormValidationRoutes;
