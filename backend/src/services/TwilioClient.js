// TODO move the API clients somewhere else
const twilio = require('twilio');

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} = process.env;
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function getCall(twilioCallSid) {
  return twilioClient.calls(twilioCallSid).fetch();
}

async function getCallsByIncomingSid(twilioCallSid) {
  return twilioClient.calls.list({ parentCallSid: twilioCallSid });
}

// It's important to specify this is outgoing because TwiML from the browser is treated as an 'incoming call'
// This means that the sid received by the hook are for the parent TwiML call and not the actual status of the outgoing call.
// OMG KILL ME
async function listOutgoingCalls(options = { limit: 20 }) {
  return twilioClient.calls.list({
    from: TWILIO_PHONE_NUMBER,
    ...options,
  });
}

module.exports = {
  getCall,
  listOutgoingCalls,
  getCallsByIncomingSid,
};
