import { Transaction } from 'sequelize';
import { logger } from '../config';
import {
  Transaction as TransactionEntity,
  Wallet as WalletEntity,
  WalletTransaction as WalletTransactionEntity,
  sequelize,
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

  async function getWalletForUser(userId: number, transaction?: Transaction) {
    return WalletModel.findOne({
      transaction,
      where: {
        userId,
      },
    });
  }

  async function processTransaction(
    userId: number,
    amount: number,
    transactionId: number
  ): Promise<WalletEntity | null> {
    await sequelize.transaction(async (transaction) => {
      const wallet = await getWalletForUser(userId, transaction);
      if (!wallet) {
        const msg = `No wallet found for userId ${userId}`;
        logger.error(msg);
        throw new Error(msg);
      }

      await WalletModel.increment(['callTime'], {
        by: amount,
        where: {
          userId,
        },
        transaction,
      });

      await wallet.reload();

      await WalletTransactionModel.create(
        {
          callTime: wallet.callTime + amount,
          userId,
          transactionId,
        },
        { transaction }
      );
    });

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
