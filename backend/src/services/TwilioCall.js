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
      where: {
        status: {
          [Op.or]: {
            [Op.in]: ['', 'in-progress', 'ringing'],
            [Op.is]: null,
          },
        },
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
  };
}

module.exports = TwilioCallService;
