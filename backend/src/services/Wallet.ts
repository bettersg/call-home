import { logger } from '../config';
import type {
  Transaction as TransactionEntity,
  Wallet as WalletEntity,
  WalletTransaction as WalletTransactionEntity,
} from '../models';

interface WalletService {
  handleTransactionCreated: (
    transaction: TransactionEntity
  ) => Promise<WalletEntity | null>;
  getWalletForUser: (userId: number) => Promise<WalletEntity | null>;
  createWalletForUser: (userId: number) => Promise<WalletEntity>;
}

function WalletService(
  WalletModel: typeof WalletEntity,
  WalletTransactionModel: typeof WalletTransactionEntity
): WalletService {
  async function createWalletForUser(userId: number) {
    // TODO looks like this can be replaced with findOrCreate
    const currentWallet = await WalletModel.findOne({
      where: {
        userId,
      },
    });
    if (currentWallet) {
      return currentWallet;
    }
    return WalletModel.create({ userId });
  }

  async function getWalletForUser(userId: number) {
    return WalletModel.findOne({
      where: {
        userId,
      },
    });
  }

  async function processTransaction(
    userId: number,
    amount: number,
    transactionId: number
  ) {
    const wallet = await getWalletForUser(userId);
    if (!wallet) {
      const msg = `No wallet found for userId ${userId}`;
      logger.error(msg);
      throw new Error(msg);
    }
    // TODO use sequelize's increment instead of setting this on our own
    const walletUpdatePromise = WalletModel.update(
      {
        callTime: wallet.callTime + amount,
      },
      {
        where: {
          userId,
        },
      }
    );
    const walletTransactionPromise = WalletTransactionModel.create({
      callTime: wallet.callTime + amount,
      userId,
      transactionId,
    });
    await Promise.all([walletUpdatePromise, walletTransactionPromise]);
    return getWalletForUser(userId);
  }

  async function handleTransactionCreated(transaction: TransactionEntity) {
    logger.info(
      'Processing wallet transaction %s',
      JSON.stringify(transaction)
    );
    const { userId, amount, id: transactionId } = transaction;
    return processTransaction(userId, amount, transactionId);
  }
  return {
    handleTransactionCreated,
    getWalletForUser,
    createWalletForUser,
  };
}

export { WalletService };
export default WalletService;
