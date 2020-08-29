const logger = require('pino')();

module.exports = function backfillDuration(twilioCallService, twilioClient) {
  async function job() {
    try {
      logger.info('backfillDuration==========');
      const twilioCalls = await twilioCallService.getCallsMissingDuration();
      const handleCall = async (twilioCall) => {
        const { duration } = await twilioClient.getCall(twilioCall.twilioSid);
        twilioCallService.updateTwilioCall(twilioCall.id, {
          duration: Number(duration),
        });
      };
      twilioCalls.forEach(handleCall);
    } catch (error) {
      logger.error(error);
    } finally {
      setTimeout(job, 20000);
    }
  }
  job();
};
