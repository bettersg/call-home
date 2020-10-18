import { DateTime } from 'luxon';
import { Op } from 'sequelize';
import { logger } from '../config';
import { sanitizeDbErrors } from './lib';
import { shouldEnableCallLimits } from './Feature';
import type { Call as CallEntity } from '../models';
import type Wallet from './Wallet';

// TODO this isn't really used
const callAggregationPeriod = 'month';

function CallService(
  CallModel: typeof CallEntity,
  userService: any,
  contactService: any,
  walletService: Wallet
) {
  async function checkWalletBalance(userId: number) {
    const wallet = await walletService.getWalletForUser(userId);
    logger.info('Wallet call time is %s', wallet.callTime);
    if (wallet.callTime <= 0) {
      throw new Error('Validation Error: INSUFFICIENT_CALL_TIME');
    }
  }

  // TODO This is actually wrong, we should be authorizing the token, not the call
  async function validateCall(userId: number, contactId: number) {
    const user = await userService.getUser(userId);
    if (!user.isPhoneNumberValidated) {
      throw new Error(`Authorization error for user ${userId}`);
    }

    if (shouldEnableCallLimits(userId)) {
      await checkWalletBalance(userId);
    }

    const userContacts = await contactService.listContactsByUserId(userId);

    if (
      userContacts.findIndex((contact: any) => contact.id === contactId) < 0
    ) {
      throw new Error(`Authorization error for user ${userId}`);
    }
    return true;
  }

  async function createCall({
    userId,
    contactId,
    incomingTwilioCallSid,
  }: Partial<CallEntity>) {
    await validateCall(userId, contactId);
    const contact = await contactService.getContact(userId, contactId);
    const call = {
      phoneNumber: contact.phoneNumber,
      contactId,
      userId,
      incomingTwilioCallSid,
    };
    return sanitizeDbErrors(() => CallModel.create(call));
  }

  async function getUserCallsForPeriod(userId: number): Promise<CallEntity[]> {
    const startDate: Date = DateTime.local()
      .startOf(callAggregationPeriod)
      .toJSDate();
    return CallModel.findAll({
      where: {
        [Op.and]: {
          userId,
          createdAt: {
            [Op.gte]: startDate,
          },
        },
      },
    });
  }

  async function getCallByIncomingSid(incomingTwilioCallSid: string) {
    return CallModel.findOne({
      where: {
        incomingTwilioCallSid,
      },
    });
  }
  return {
    createCall,
    getUserCallsForPeriod,
    getCallByIncomingSid,
  };
}

export default CallService;
