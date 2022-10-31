import express, { Router } from 'express';
import * as z from 'zod';
import { requireAdmin } from './middlewares';
import type { AdminGrantedValidation } from '../services';
import {
  validateRequest,
  stringToNumberTransformer,
} from './helpers/validation';

const POST_SCHEMA = z.object({
  body: z.object({
    userId: z.number(),
  }),
});

const DELETE_SCHEMA = z.object({
  params: z.object({
    userId: stringToNumberTransformer,
  }),
});

function AdminGrantedValidationRoutes(
  workpassValidation: typeof AdminGrantedValidation
): Router {
  const router = express.Router();

  router.post(
    '/',
    requireAdmin,
    validateRequest(POST_SCHEMA, async (parsedReq, res, req) => {
      const { userId } = parsedReq.body;
      const { user } = req;

      await workpassValidation.validateUser({
        grantingUserId: user.id,
        userId,
      });

      return res.status(200).send();
    })
  );

  router.delete(
    '/:userId',
    requireAdmin,
    validateRequest(DELETE_SCHEMA, async (parsedReq, res, req) => {
      const { userId } = parsedReq.params;

      await workpassValidation.invalidateUser(userId);

      return res.status(200).send();
    })
  );

  return router;
}

export default AdminGrantedValidationRoutes;
