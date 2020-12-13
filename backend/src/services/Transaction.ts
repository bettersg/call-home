import { sanitizeDbErrors } from './lib';
import type { Transaction as TransactionEntity } from '../models';
import type { WalletService } from './Wallet';

function TransactionService(
  TransactionModel: typeof TransactionEntity,
  walletService: ReturnType<typeof WalletService>
): {
  createTransaction: (
    newTransaction: Partial<TransactionEntity>
  ) => Promise<TransactionEntity>;
  getTransactionsForUser: (userId: number) => Promise<TransactionEntity[]>;
} {
  async function createTransaction({
    reference,
    userId,
    amount,
  }: Partial<TransactionEntity>) {
    const transaction = await sanitizeDbErrors(() =>
      TransactionModel.create({
        reference,
        userId,
        amount,
      })
    );
    await walletService.handleTransactionCreated(transaction);
    return transaction;
  }

  async function getTransactionsForUser(
    userId: number
  ): Promise<TransactionEntity[]> {
    return TransactionModel.findAll({
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']],
    });
  }

  return {
    createTransaction,
    getTransactionsForUser,
  };
}

export { TransactionService };
export default TransactionService;
