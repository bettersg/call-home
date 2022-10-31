import { Op } from 'sequelize';
import { sanitizeDbErrors } from './lib';
import { logger } from '../config';
import type { TwilioCall as TwilioCallEntity, CallType } from '../models';
import type { Call, TwilioClient, Transaction } from './index';

function TwilioCallService(
  TwilioCallModel: typeof TwilioCallEntity,
  twilioClient: typeof TwilioClient,
  callService: typeof Call,
  transactionService: typeof Transaction
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

  async function listTwilioCallsByParentSids(parentCallSids: string[]) {
    return TwilioCallModel.findAll({
      where: {
        parentCallSid: parentCallSids,
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

  async function getCompletedNoPriceCallsOrderByLastUpdated() {
    return TwilioCallModel.findAll({
      // Add an arbitrary limit just in case
      limit: 100,
      where: {
        status: 'completed',
        price: null,
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

  async function createTransactionForTwilioCall(twilioCall: TwilioCallEntity) {
    logger.info('Creating transaction for twilio call %s', twilioCall);
    const callEntity = await callService.getCallByIncomingSid(
      twilioCall.parentCallSid
    );
    if (!callEntity) {
      const msg = `callEntity not found for parentCallSid ${twilioCall.parentCallSid}`;
      logger.error(msg);
      throw new Error(msg);
    }
    return transactionService.createTransaction({
      reference: 'call',
      userId: callEntity.userId,
      amount: -twilioCall.duration,
      additionalReference: String(twilioCall.id as number),
    });
  }

  // Collects the business logic for updating twilio calls by calling the Twilio API.
  // Used in two places: the status callback and the pending calls poller
  async function fetchTwilioDataForTwilioCall(twilioCall: TwilioCallEntity) {
    logger.info(
      'fetchTwilioDataForTwilioCall -> Updating call with id: %s',
      twilioCall.id
    );
    const { parentCallSid, callType } = twilioCall;
    const [twilioResponseCalls, twilioParentCall] = await Promise.all([
      twilioClient.getCallsByIncomingSid(parentCallSid, callType ?? 'personal'),
      twilioClient.getCall(parentCallSid, callType ?? 'personal'),
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
      const oldCallDuration = twilioCall.duration;
      await updateTwilioCall(twilioCall.id, {
        twilioSid,
        fromPhoneNumber,
        toPhoneNumber,
        status,
        price,
        priceUnit,
        duration: Number(duration),
      });
      await twilioCall.reload();
      // TODO seems like it might be possible to create duplicate transactions, there should be a way to protect against
      if (oldCallDuration !== twilioCall.duration) {
        createTransactionForTwilioCall(twilioCall);
      }
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
    if (!twilioCall) {
      const msg = `twilioCall not found for parentCallSid ${parentCallSid}`;
      logger.error(msg);
      throw new Error(msg);
    }
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
    logger.info(
      'fetchTwilioDataForPendingTwilioCalls completed for %s calls',
      twilioCalls.length
    );
  }

  async function fetchTwilioDataForCompletedNoPriceTwilioCalls() {
    logger.info('fetchTwilioDataForCompletedNoPriceTwilioCalls');
    const twilioCalls = await getCompletedNoPriceCallsOrderByLastUpdated();
    await Promise.all(twilioCalls.map(fetchTwilioDataForTwilioCall));
    logger.info(
      'fetchTwilioDataForCompletedNoPriceTwilioCalls completed for %s calls',
      twilioCalls.length
    );
  }

  async function postCallFeedback(
    parentCallSid: string,
    callType: CallType,
    avgMos: number | undefined,
    qualityScore: number,
    qualityIssue?: string
  ): Promise<number | null> {
    const feedback = await twilioClient.postCallFeedback(
      parentCallSid,
      callType,
      qualityScore,
      qualityIssue
    );
    const twilioCall = await getTwilioCallByParentSid(parentCallSid);
    if (!twilioCall) {
      return null;
    }
    twilioCall.qualityScore = qualityScore;
    twilioCall.qualityIssue = qualityIssue;
    twilioCall.avgMos = avgMos;
    await twilioCall.save();
    return feedback.qualityScore;
  }

  return {
    createTwilioCall,
    fetchTwilioDataForPendingTwilioCalls,
    fetchTwilioDataForTwilioParentSid,
    fetchTwilioDataForCompletedNoPriceTwilioCalls,
    listTwilioCallsByParentSids,
    getCallsMissingDuration,
    getTwilioCallBySid,
    getTwilioCallByParentSid,
    postCallFeedback,
  };
}

export { TwilioCallService };
export default TwilioCallService;
