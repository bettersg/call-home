import { logger } from '../config';
import { sanitizeDbErrors } from './lib';
import type { Transaction as TransactionEntity } from '../models';
import type TwilioCallService from './TwilioCall';
import type CallService from './Call';

class TransactionService {
  transactionModel: typeof TransactionEntity;

  twilioCallService: TwilioCallService;

  callService: ReturnType<typeof CallService>;

  constructor(
    transactionModel: typeof TransactionEntity,
    twilioCallService: TwilioCallService,
    callService: ReturnType<typeof CallService>
  ) {
    this.transactionModel = transactionModel;
    this.twilioCallService = twilioCallService;
    this.callService = callService;
    this.twilioCallService.on('twilio-call-updated', async ({ twilioCall }) => {
      logger.info('Creating transaction for twilio call %s', twilioCall);
      const callEntity = await callService.getCallByIncomingSid(
        twilioCall.parentCallSid
      );
      await this.createTransaction({
        reference: 'call',
        userId: callEntity.userId,
        amount: -twilioCall.duration,
      });
    });
  }

  async createTransaction({
    reference,
    userId,
    amount,
  }: Partial<TransactionEntity>) {
    return sanitizeDbErrors(() =>
      this.transactionModel.create({
        reference,
        userId,
        amount,
      })
    );
  }

  async getTransactionsForUser(userId: number) {
    return this.transactionModel.findAll({
      where: {
        userId,
      },
    });
  }
}

export default TransactionService;
