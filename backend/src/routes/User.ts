import express from 'express';
import { CallHomeRequest } from './middlewares';
import type { Wallet } from '../services';

// Reads a req and parses the body into a user that can be saved.

function UserRoutes(walletService: typeof Wallet) {
  const router = express.Router();

  router.get('/me', async (req: CallHomeRequest, res) => {
    await walletService.createWalletForUser(req.user.id);
    return res.status(200).json(req.user);
  });

  return router;
}

export default UserRoutes;
