import express from 'express';
import { CallHomeRequest, requireAdmin } from './middlewares';
import { userToUserResponse } from './transformers';
import type { User, Wallet, PeriodicCredit } from '../services';

// Reads a req and parses the body into a user that can be saved.
function UserRoutes(
  userService: typeof User,
  periodicCreditService: typeof PeriodicCredit,
  walletService: typeof Wallet
) {
  const router = express.Router();

  router.get('/me', async (req: CallHomeRequest, res) => {
    const userId = req.user.id;
    let userTasks: Promise<any>[] = [walletService.createWalletForUser(userId)];
    if (req.user.isVerified) {
      userTasks = [
        ...userTasks,
        periodicCreditService.tryCreatePeriodicCredit(userId),
      ];
    }
    await Promise.all(userTasks);
    return res.status(200).json(req.user);
  });

  router.get('/', requireAdmin, async (_req: CallHomeRequest, res) => {
    const users = await userService.listUsers();
    const usersWithWallet = await Promise.all(
      users.map(async (user) => {
        const wallet = await walletService.getWalletForUser(user.id);
        return {
          ...userToUserResponse(user),
          callTime: wallet?.callTime,
        };
      })
    );
    return res.json(usersWithWallet);
  });

  return router;
}

export default UserRoutes;
