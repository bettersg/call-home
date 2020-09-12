import { logger } from '../config';
import type { TwilioCall as TwilioCallEntity } from '../models';
import type { TwilioCall, TwilioClient } from '../services';

const jobIntervalMillis = 20000;

// call duration only seems to update at the END of the call. This means that we need some other way of tracking in-progress calls?

function refreshConnectedCalls(
  twilioCallService: typeof TwilioCall,
  twilioClient: typeof TwilioClient
) {
  async function job() {
    try {
      logger.info('refreshConnectedCalls==========');
      const twilioCalls = await twilioCallService.getPendingCallsOrderByLastUpdated();
      const handleCall = async (twilioCall: TwilioCallEntity) => {
        logger.info('refreshConnectedCalls -> Updating call', twilioCall.id);
        const { parentCallSid } = twilioCall;
        const [twilioResponseCalls, twilioParentCall] = await Promise.all([
          twilioClient.getCallsByIncomingSid(parentCallSid),
          twilioClient.getCall(parentCallSid),
        ]);
        if (twilioParentCall.status === 'canceled') {
          await twilioCallService.updateTwilioCall(twilioCall.id, {
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
          await twilioCallService.updateTwilioCall(twilioCall.id, {
            twilioSid,
            fromPhoneNumber,
            toPhoneNumber,
            status,
            price,
            priceUnit,
            duration: Number(duration),
          });
        } else {
          if (twilioParentCall.status === 'completed') {
            // It is possible for the parent call to complete without the child call happening
            // e.g. an error occurs.
            await twilioCallService.updateTwilioCall(twilioCall.id, {
              status: 'x-not-initiated',
            });
            return;
          }
          logger.error(
            'Expected exactly one child call for parent SID. This is a potential error. SID: ',
            twilioCall.parentCallSid
          );
        }
      };
      twilioCalls.forEach(handleCall);
    } catch (error) {
      logger.error(error);
    } finally {
      setTimeout(job, jobIntervalMillis);
    }
  }
  job();
}

export default refreshConnectedCalls;
