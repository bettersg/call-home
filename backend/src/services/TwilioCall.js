const { Op } = require('sequelize');
const { sanitizeDbErrors } = require('./lib');

function TwilioCallService(TwilioCallModel) {
  async function createTwilioCall(twilioCall) {
    return sanitizeDbErrors(() => TwilioCallModel.create(twilioCall));
  }

  async function updateTwilioCall(twilioCallId, twilioCall) {
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

  async function getTwilioCallBySid(twilioSid) {
    return TwilioCallModel.findOne({
      where: {
        twilioSid,
      },
    });
  }

  async function getTwilioCallByParentSid(parentCallSid) {
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

module.exports = TwilioCallService;
