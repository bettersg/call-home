import { sanitizeDbErrors, TypedEventEmitter } from './lib';
import type { Transaction as TransactionEntity } from '../models';

export type TransactionServiceEvent = 'transaction-created';
export interface TransactionCreatedPayload {
  type: 'transaction-created';
  transaction: TransactionEntity;
}
export type TransactionServicePayload = TransactionCreatedPayload;

// TODO We're not doing this event emitter thing any more.
class TransactionService extends TypedEventEmitter<
  TransactionServiceEvent,
  TransactionServicePayload
> {
  transactionModel: typeof TransactionEntity;

  constructor(transactionModel: typeof TransactionEntity) {
    super();
    this.transactionModel = transactionModel;
  }

  async createTransaction({
    reference,
    userId,
    amount,
  }: Partial<TransactionEntity>) {
    const transaction = await sanitizeDbErrors(() =>
      this.transactionModel.create({
        reference,
        userId,
        amount,
      })
    );
    this.emit('transaction-created', {
      type: 'transaction-created',
      transaction,
    });
    return transaction;
  }

  async getTransactionsForUser(userId: number) {
    return this.transactionModel.findAll({
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']],
    });
  }
}

export { TransactionService };
export default TransactionService;
