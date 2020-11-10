import { logger } from '../config';
import type { Wallet as WalletEntity } from '../models';
import { shouldEnableCallLimits } from './Feature';
import type {
  TransactionService,
  TransactionCreatedPayload,
} from './Transaction';

class WalletService {
  walletModel: typeof WalletEntity;

  transactionService: TransactionService;

  constructor(
    walletModel: typeof WalletEntity,
    transactionService: TransactionService
  ) {
    this.walletModel = walletModel;
    this.transactionService = transactionService;

    this.transactionService.on(
      'transaction-created',
      this.handleTransactionCreated
    );
  }

  handleTransactionCreated = async ({
    transaction,
  }: TransactionCreatedPayload) => {
    logger.info('Processing wallet transaction %s', transaction);
    const { userId, amount } = transaction;
    return this.processTransaction(userId, amount);
  };

  createWalletForUser = async (userId: number) => {
    const currentWallet = await this.walletModel.findOne({
      where: {
        userId,
      },
    });
    if (currentWallet) {
      return currentWallet;
    }
    return this.walletModel.create({ userId });
  };

  getWalletForUser = async (userId: number) => {
    return this.walletModel.findOne({
      where: {
        userId,
      },
    });
  };

  processTransaction = async (userId: number, amount: number) => {
    const wallet = await this.getWalletForUser(userId);
    // If call limits are not enabled, we don't subtract from the user's balance.
    if (!shouldEnableCallLimits(userId)) {
      return wallet;
    }
    if (!wallet) {
      const msg = `No wallet found for userId ${userId}`;
      logger.error(msg);
      throw new Error(msg);
    }
    await this.walletModel.update(
      {
        callTime: wallet.callTime + amount,
      },
      {
        where: {
          userId,
        },
      }
    );
    return this.getWalletForUser(userId);
  };
}

export default WalletService;
