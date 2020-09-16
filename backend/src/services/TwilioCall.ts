import { Op } from 'sequelize';
import { sanitizeDbErrors } from './lib';
import { logger } from '../config';
import type { TwilioCall as TwilioCallEntity } from '../models';
import type TwilioClient from './TwilioClient';

function TwilioCallService(
  TwilioCallModel: typeof TwilioCallEntity,
  twilioClient: typeof TwilioClient
) {
  async function createTwilioCall(twilioCall: Partial<TwilioCallEntity>) {
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

  // Collects the business logic for updating twilio calls by calling the Twilio API.
  // Used in two places: the status callback and the pending calls poller
  async function fetchTwilioDataForTwilioCall(twilioCall: TwilioCallEntity) {
    logger.info('fetchTwilioDataForTwilioCall -> Updating call', twilioCall.id);
    const { parentCallSid } = twilioCall;
    const [twilioResponseCalls, twilioParentCall] = await Promise.all([
      twilioClient.getCallsByIncomingSid(parentCallSid),
      twilioClient.getCall(parentCallSid),
    ]);
    if (twilioParentCall.status === 'canceled') {
      await updateTwilioCall(twilioCall.id, {
        status: 'x-parent-canceled',
      });
      return;
    }
    if (twilioResponseCalls.length === 1) {
      const [twilioResponseCall] = twilioResponseCalls;
      const {
        sid: twilioSid,
        from: fromPhoneNumber,
        to: toPhoneNumber,
        duration,
        status,
        price,
        priceUnit,
      } = twilioResponseCall;
      await updateTwilioCall(twilioCall.id, {
        twilioSid,
        fromPhoneNumber,
        toPhoneNumber,
        status,
        price,
        priceUnit,
        duration: Number(duration),
      });
      return;
    }
    if (twilioParentCall.status === 'completed') {
      // It is possible for the parent call to complete without the child call happening
      // e.g. an error occurs.
      await updateTwilioCall(twilioCall.id, {
        status: 'x-not-initiated',
      });
      return;
    }
    logger.error(
      'Expected exactly one child call for parent SID. This is a potential error. SID: ',
      twilioCall.parentCallSid
    );
  }

  async function fetchTwilioDataForTwilioParentSid(parentCallSid: string) {
    logger.info('fetchTwilioDataForTwilioParentSid -> %s', parentCallSid);
    const twilioCall = await getTwilioCallByParentSid(parentCallSid);
    await fetchTwilioDataForTwilioCall(twilioCall);
    logger.info(
      'fetchTwilioDataForTwilioParentSid completed -> %s',
      parentCallSid
    );
  }

  async function fetchTwilioDataForPendingTwilioCalls() {
    logger.info('fetchTwilioDataForPendingTwilioCalls');
    const twilioCalls = await getPendingCallsOrderByLastUpdated();
    await Promise.all(twilioCalls.map(fetchTwilioDataForTwilioCall));
    logger.info('fetchTwilioDataForPendingTwilioCalls completed');
  }

  return {
    createTwilioCall,
    updateTwilioCall,
    getTwilioCallBySid,
    getTwilioCallByParentSid,
    getPendingCallsOrderByLastUpdated,
    getCallsMissingDuration,
    fetchTwilioDataForTwilioParentSid,
    fetchTwilioDataForPendingTwilioCalls,
  };
}

export { TwilioCallService };
export default TwilioCallService;
