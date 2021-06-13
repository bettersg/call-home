import express, { Response, Router } from 'express';
import * as z from 'zod';
import { TransactionResponse } from '@call-home/shared/types/Transaction';
import type { Transaction } from '../services';
import { requireAdmin } from './middlewares';
import {
  validateRequest,
  stringToNumberTransformer,
} from './helpers/validation';

const GET_SCHEMA = z.object({
  params: z.object({ userId: stringToNumberTransformer }),
});

const POST_SCHEMA = z.object({
  params: z.object({ userId: stringToNumberTransformer }),
  body: z.object({ amount: z.number() }),
});

function TransactionRoutes(transactionService: typeof Transaction): Router {
  const router = express.Router();

  router.get(
    '/:userId/transactions/',
    requireAdmin,
    validateRequest(
      GET_SCHEMA,
      async (parsedReq, res: Response<TransactionResponse[]>) => {
        const { userId } = parsedReq.params;
        const transactions = await transactionService.getTransactionsForUser(
          userId
        );
        return res.json(transactions);
      }
    )
  );

  router.post(
    '/:userId/transactions/',
    requireAdmin,
    validateRequest(
      POST_SCHEMA,
      async (parsedReq, res: Response<TransactionResponse>) => {
        const { userId } = parsedReq.params;
        const { amount } = parsedReq.body;
        const transaction = await transactionService.createTransaction({
          userId,
          reference: 'admin',
          amount,
          additionalReference: null,
        });
        return res.json(transaction);
      }
    )
  );

  return router;
}

export default TransactionRoutes;
