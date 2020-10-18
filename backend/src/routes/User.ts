import express from 'express';
import { CallHomeRequest, requireAdmin } from './middlewares';
import { userToUserResponse } from './transformers';
import type { User, Wallet, PeriodicCredit } from '../services';

function UserRoutes(
  userService: typeof User,
  periodicCreditService: typeof PeriodicCredit,
  walletService: typeof Wallet
) {
  const router = express.Router();

  async function injectWallet(user: ReturnType<typeof userToUserResponse>) {
    const wallet = await walletService.getWalletForUser(user.id);
    return {
      ...user,
      callTime: wallet?.callTime,
    };
  }

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
    const userWithWallet = await injectWallet(req.user);
    return res.status(200).json(userWithWallet);
  });

  router.get('/', requireAdmin, async (_req: CallHomeRequest, res) => {
    const users = await userService.listUsers();
    const usersWithWallet = await Promise.all(
      // We have to use userToUserResponse because this takes the raw user
      users.map(userToUserResponse).map(injectWallet)
    );
    return res.json(usersWithWallet);
  });

  return router;
}

export default UserRoutes;
