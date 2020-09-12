import { Op } from 'sequelize';
import { sanitizeDbErrors } from './lib';
import { TwilioCall as TwilioCallEntity } from '../models';

interface TwilioCallService {
  createTwilioCall: (twilioCall: TwilioCallEntity) => Promise<TwilioCallEntity>;
  updateTwilioCall: (
    twilioCallId: number,
    twilioCall: Partial<TwilioCallEntity>
  ) => Promise<[number, TwilioCallEntity[]]>;
  getTwilioCallBySid: (twilioSid: string) => Promise<TwilioCallEntity>;
  getTwilioCallByParentSid: (
    parentCallSid: string
  ) => Promise<TwilioCallEntity>;
  getPendingCallsOrderByLastUpdated: () => Promise<TwilioCallEntity[]>;
  getCallsMissingDuration: () => Promise<TwilioCallEntity[]>;
}

function TwilioCallService(
  TwilioCallModel: typeof TwilioCallEntity
): TwilioCallService {
  async function createTwilioCall(twilioCall: TwilioCallEntity) {
    return sanitizeDbErrors(() => TwilioCallModel.create(twilioCall));
  }

  async function updateTwilioCall(
    twilioCallId: number,
    twilioCall: Partial<TwilioCallEntity>
  ) {
    return TwilioCallModel.update(
      {
        ...twilioCall,
        lastUpdated: new Date(),
      },
      {
        where: {
          id: twilioCallId,
        },
      }
    );
  }

  async function getTwilioCallBySid(twilioSid: string) {
    return TwilioCallModel.findOne({
      where: {
        twilioSid,
      },
    });
  }

  async function getTwilioCallByParentSid(parentCallSid: string) {
    return TwilioCallModel.findOne({
      where: {
        parentCallSid,
      },
    });
  }

  async function getPendingCallsOrderByLastUpdated() {
    return TwilioCallModel.findAll({
      // Add an arbitrary limit just in case
      limit: 100,
      where: {
        status: {
          [Op.or]: {
            [Op.in]: [
              '',
              'in-progress',
              'ringing',
              'queued',
              'x-parent-completed',
            ],
            [Op.is]: null,
          },
        },
      },
      order: [['lastUpdated', 'ASC']],
    });
  }

  async function getCallsMissingDuration() {
    return TwilioCallModel.findAll({
      // Add an arbitrary limit just in case
      limit: 100,
      where: {
        status: 'completed',
        duration: null,
      },
      order: [['lastUpdated', 'ASC']],
    });
  }

  return {
    createTwilioCall,
    updateTwilioCall,
    getTwilioCallBySid,
    getTwilioCallByParentSid,
    getPendingCallsOrderByLastUpdated,
    getCallsMissingDuration,
  };
}

export { TwilioCallService };
export default TwilioCallService;
