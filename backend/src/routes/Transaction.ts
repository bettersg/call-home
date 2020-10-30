import express, { Request, Response, Router } from 'express';
import * as z from 'zod';
import type { Transaction } from '../services';
import { requireAdmin } from './middlewares';
import { logger } from '../config';
import { stringToNumberTransformer } from './helpers/validation';

function TransactionRoutes(transactionService: typeof Transaction): Router {
  const router = express.Router();

  router.get(
    '/:userId/transactions/',
    requireAdmin,
    async (req: Request, res: Response) => {
      let validatedReq;
      try {
        const paramsSchema = z.object({
          userId: stringToNumberTransformer,
        });
        const params = paramsSchema.parse(req.params);
        validatedReq = { params };
      } catch (error) {
        logger.error(error);
        return res.status(400).send(error);
      }

      const { userId } = validatedReq.params;
      const transactions = await transactionService.getTransactionsForUser(
        userId
      );
      return res.json(transactions);
    }
  );

  router.post(
    '/:userId/transactions/',
    requireAdmin,
    async (req: Request, res: Response) => {
      let validatedReq;
      try {
        const paramsSchema = z.object({
          userId: stringToNumberTransformer,
        });
        const bodySchema = z.object({
          amount: z.number(),
        });
        const params = paramsSchema.parse(req.params);
        const body = bodySchema.parse(req.body);
        validatedReq = { params, body };
      } catch (error) {
        logger.error(error);
        return res.status(400).send(error);
      }

      const { userId } = validatedReq.params;
      const { amount } = validatedReq.body;

      const transaction = await transactionService.createTransaction({
        userId,
        reference: 'admin',
        amount,
      });
      return res.json(transaction);
    }
  );

  return router;
}

export default TransactionRoutes;
