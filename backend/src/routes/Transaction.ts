import express, { Request, Response } from 'express';
import type { Transaction } from '../services';
import { requireAdmin } from './middlewares';

function TransactionRoutes(transactionService: typeof Transaction) {
  const router = express.Router();

  router.get(
    '/:userId/transactions/',
    requireAdmin,
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const transactions = await transactionService.getTransactionsForUser(
        Number(userId)
      );
      return res.json(transactions);
    }
  );

  router.post(
    '/:userId/transactions/',
    requireAdmin,
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const { amount } = req.body as { amount: number | undefined };
      if (!amount) {
        return res
          .status(400)
          .json('Invalid transaction, amount must be specified');
      }
      if (!Number(userId) || !Number(amount)) {
        return res.status(400).json('Invalid transaction.');
      }
      const transaction = await transactionService.createTransaction({
        userId: Number(userId),
        reference: 'admin',
        amount: Number(amount),
      });
      return res.json(transaction);
    }
  );

  return router;
}

export default TransactionRoutes;
