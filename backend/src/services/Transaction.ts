import { logger } from '../config';
import { sanitizeDbErrors, TypedEventEmitter } from './lib';
import type { Transaction as TransactionEntity } from '../models';
import type { TwilioCallService, TwilioCallUpdatedPayload } from './TwilioCall';

import type CallService from './Call';

export type TransactionServiceEvent = 'transaction-created';
export interface TransactionCreatedPayload {
  type: 'transaction-created';
  transaction: TransactionEntity;
}
export type TransactionServicePayload = TransactionCreatedPayload;

class TransactionService extends TypedEventEmitter<
  TransactionServiceEvent,
  TransactionServicePayload
> {
  transactionModel: typeof TransactionEntity;

  twilioCallService: TwilioCallService;

  callService: ReturnType<typeof CallService>;

  constructor(
    transactionModel: typeof TransactionEntity,
    twilioCallService: TwilioCallService,
    callService: ReturnType<typeof CallService>
  ) {
    super();
    this.transactionModel = transactionModel;
    this.twilioCallService = twilioCallService;
    this.callService = callService;
    this.twilioCallService.on(
      'twilio-call-updated',
      this.handleTwilioCallUpdate
    );
  }

  // TODO upon further reflection, maybe the twilio call service should just call this service. the event emitter semantics seem a bit unnecessary.
  handleTwilioCallUpdate = async ({ twilioCall }: TwilioCallUpdatedPayload) => {
    logger.info('Creating transaction for twilio call %s', twilioCall);
    const callEntity = await this.callService.getCallByIncomingSid(
      twilioCall.parentCallSid
    );
    return this.createTransaction({
      reference: 'call',
      userId: callEntity.userId,
      amount: -twilioCall.duration,
    });
  };

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
