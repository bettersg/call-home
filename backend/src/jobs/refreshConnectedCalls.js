module.exports = function refreshConnectedCalls(
  twilioCallService,
  twilioClient
) {
  async function job() {
    try {
      console.log('refreshConnectedCalls==========');
      const twilioCalls = await twilioCallService.getPendingCallsOrderByLastUpdated();
      twilioCalls.forEach(async (twilioCall) => {
        console.log('refreshConnectedCalls -> Updating call', twilioCall.id);
        const twilioResponseCalls = await twilioClient.getCallsByIncomingSid(
          twilioCall.parentCallSid
        );
        if (twilioResponseCalls.length !== 1) {
          console.error(
            'Expected exactly one child call for parent SID. This is a potential error. SID: ',
            twilioCall.parentCallSid
          );
          return;
        }
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
      });
    } finally {
      setTimeout(job, 20000);
    }
  }
  job();
};
