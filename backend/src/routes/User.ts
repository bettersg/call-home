import express from 'express';
import {
  UserInjectedRequest,
  requireAdmin,
  isUserVerified,
} from './middlewares';
import { userToUserResponse, UserResponse } from './transformers';
import type { User as UserModel } from '../models';
import type {
  User,
  Wallet,
  PeriodicCredit,
  PhoneNumberValidation,
  WorkpassValidation,
} from '../services';

function UserRoutes(
  userService: typeof User,
  periodicCreditService: typeof PeriodicCredit,
  phoneNumberValidationService: typeof PhoneNumberValidation,
  workpassValidationService: typeof WorkpassValidation,
  walletService: typeof Wallet
) {
  const router = express.Router();

  async function injectPhoneNumberValidation(user: UserModel) {
    const [phoneNumberValidation, workpassValidation] = await Promise.all([
      phoneNumberValidationService.getPhoneNumberValidationForUser(user.id),
      workpassValidationService.getWorkpassValidationForUser(user.id),
    ]);
    return userToUserResponse(user, phoneNumberValidation, workpassValidation);
  }

  async function injectWallet(user: UserResponse) {
    const wallet = await walletService.getWalletForUser(user.id);
    return {
      ...user,
      callTime: wallet?.callTime,
    };
  }

  router.get('/me', async (req: UserInjectedRequest, res) => {
    const { user } = req;
    let userTasks: Promise<any>[] = [
      walletService.createWalletForUser(user.id),
    ];
    if (isUserVerified(req.user)) {
      userTasks = [
        ...userTasks,
        periodicCreditService.tryCreatePeriodicCredit(user.id),
      ];
    }
    await Promise.all(userTasks);
    const userWithWallet = await injectWallet(req.user);
    // Return isVerified for old clients
    return res
      .status(200)
      .json({ ...userWithWallet, isVerified: isUserVerified(req.user) });
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
