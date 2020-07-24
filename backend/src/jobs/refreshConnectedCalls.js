module.exports = function refreshConnectedCalls(
  twilioCallService,
  twilioClient
) {
  async function job() {
    try {
      console.log('refreshConnectedCalls==========');
      const twilioCalls = await twilioCallService.getPendingCallsOrderByLastUpdated();
      const handleCall = async (twilioCall) => {
        console.log('refreshConnectedCalls -> Updating call', twilioCall.id);
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
        if (twilioParentCall.status === 'completed') {
          // It is possible for the parent call to complete without the child call happening
          // e.g. an error occurs.
          await twilioCallService.updateTwilioCall(twilioCall.id, {
            status: 'x-parent-completed',
          });
          return;
        }
        if (twilioResponseCalls.length === 1) {
          const [twilioResponseCall] = twilioResponseCalls;
          const {
            sid: twilioSid,
            from: fromPhoneNumber,
            to: toPhoneNumber,
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
          });
        } else {
          console.error(
            'Expected exactly one child call for parent SID. This is a potential error. SID: ',
            twilioCall.parentCallSid
          );
        }
      };
      twilioCalls.forEach(handleCall);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(job, 20000);
    }
  }
  job();
};
