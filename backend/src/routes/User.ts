import express from 'express';
import { UserInjectedRequest, requireAdmin } from './middlewares';
import { userToUserResponse, UserResponse } from './transformers';
import type { User as UserModel } from '../models';
import type {
  User,
  Wallet,
  PeriodicCredit,
  PhoneNumberValidation,
} from '../services';

function UserRoutes(
  userService: typeof User,
  periodicCreditService: typeof PeriodicCredit,
  phoneNumberValidationService: typeof PhoneNumberValidation,
  walletService: typeof Wallet
) {
  const router = express.Router();

  async function injectPhoneNumberValidation(user: UserModel) {
    const phoneNumberValidation = await phoneNumberValidationService.getPhoneNumberValidationForUser(
      user.id
    );
    return userToUserResponse(user, phoneNumberValidation);
  }

  async function injectWallet(user: UserResponse) {
    const wallet = await walletService.getWalletForUser(user.id);
    return {
      ...user,
      callTime: wallet?.callTime,
    };
  }

  router.get('/me', async (req: UserInjectedRequest, res) => {
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

  router.get('/', requireAdmin, async (_req: UserInjectedRequest, res) => {
    const users = await userService.listUsers();
    const usersWithPhoneNumber = await Promise.all(
      users.map(injectPhoneNumberValidation)
    );
    const usersWithWallet = await Promise.all(
      usersWithPhoneNumber.map(injectWallet)
    );
    return res.json(usersWithWallet);
  });

  return router;
}

export default UserRoutes;
