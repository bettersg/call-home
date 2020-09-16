import moment from 'moment';
import pino from 'pino';
import { Op } from 'sequelize';
import { sanitizeDbErrors } from './lib';
import type { Call as CallEntity } from '../models';

const logger = pino();

const callAggregationPeriod = 'week';

function CallService(
  CallModel: typeof CallEntity,
  userService: any,
  contactService: any
) {
  async function validateCall(userId: number, contactId: number) {
    logger.info('validating call for', userId, contactId);
    const user = await userService.getUser(userId);
    if (!user.isPhoneNumberValidated) {
      throw new Error(`Authorization error for user ${userId}`);
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
    validateCall(userId, contactId);
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
    const startDate: Date = moment().startOf(callAggregationPeriod).toDate();
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

  return {
    createCall,
    getUserCallsForPeriod,
  };
}

export default CallService;
