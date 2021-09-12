// TODO move the API clients somewhere else
import twilio from 'twilio';

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_CALL_PHONE_NUMBER,
  TWILIO_SMS_PHONE_NUMBER,
} = process.env;

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function getCall(twilioCallSid: string) {
  return twilioClient.calls(twilioCallSid).fetch();
}

async function getCallsByIncomingSid(twilioCallSid: string) {
  return twilioClient.calls.list({ parentCallSid: twilioCallSid });
}

async function sendSms(toPhoneNumber: string, body: string) {
  return twilioClient.messages.create({
    body,
    to: toPhoneNumber,
    from: TWILIO_SMS_PHONE_NUMBER,
  });
}

async function postCallFeedback(
  twilioCallSid: string,
  qualityScore: number,
  reason?: string
) {
  return twilioClient
    .calls(twilioCallSid)
    .feedback(twilioCallSid)
    .create({
      qualityScore,
      issue: reason as any, // TODO narrow down the type with proper checking
    });
}

// It's important to specify this is outgoing because TwiML from the browser is treated as an 'incoming call'
// This means that the sid received by the hook are for the parent TwiML call and not the actual status of the outgoing call.
// OMG KILL ME
async function listOutgoingCalls(options = { limit: 20 }) {
  return twilioClient.calls.list({
    from: TWILIO_CALL_PHONE_NUMBER,
    ...options,
  });
}

export {
  getCall,
  listOutgoingCalls,
  getCallsByIncomingSid,
  sendSms,
  postCallFeedback,
};
