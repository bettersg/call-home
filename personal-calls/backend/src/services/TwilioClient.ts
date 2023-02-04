// TODO move the API clients somewhere else
import twilio from 'twilio';
import { CredentialSets } from './TwilioCreds';
import type { CallType } from '../models';

const { TWILIO_SMS_PHONE_NUMBER, TWILIO_VERIFY_SID } = process.env;

const twilioClients: {
  personal: twilio.Twilio;
  healthserve?: twilio.Twilio;
} = {
  personal: twilio(
    CredentialSets.personal.accountSid,
    CredentialSets.personal.authToken
  ),
};

if (CredentialSets.healthserve) {
  twilioClients.healthserve = twilio(
    CredentialSets.healthserve.accountSid,
    CredentialSets.healthserve.authToken
  );
}


if (!TWILIO_VERIFY_SID) {
  throw Error('Missing twilio environment variables. Aborting...');
}
// TODO we probably only need this for personal calls anyway
const verifyClient = twilioClients.personal.verify.v2.services(TWILIO_VERIFY_SID);
if (!verifyClient) {
  throw Error('Unable to initialise Twilio Verify client');
}

async function getCall(twilioCallSid: string, callType: CallType) {
  return (twilioClients[callType] as twilio.Twilio)
    .calls(twilioCallSid)
    .fetch();
}

async function getCallsByIncomingSid(
  twilioCallSid: string,
  callType: CallType
) {
  return (twilioClients[callType] as twilio.Twilio).calls.list({
    parentCallSid: twilioCallSid,
  });
}

async function sendVerification(toPhoneNumber: string) {
  return verifyClient.verifications.create({
    to: toPhoneNumber,
    channel: 'sms',
  });
}

async function checkVerification(toPhoneNumber: string, code: string) {
  const result = await verifyClient.verificationChecks.create({
    to: toPhoneNumber,
    code,
  });
  if (result.status !== 'approved') {
    throw new Error('BAD_OTP');
  }
}

async function sendSms(toPhoneNumber: string, body: string) {
  return twilioClients.personal.messages.create({
    body,
    to: toPhoneNumber,
    from: TWILIO_SMS_PHONE_NUMBER,
  });
}

async function postCallFeedback(
  twilioCallSid: string,
  callType: CallType,
  qualityScore: number,
  reason?: string
) {
  return (twilioClients[callType] as twilio.Twilio)
    .calls(twilioCallSid)
    .feedback(twilioCallSid)
    .create({
      qualityScore,
      issue: reason as any, // TODO narrow down the type with proper checking
    });
}

export {
  checkVerification,
  getCall,
  getCallsByIncomingSid,
  postCallFeedback,
  sendSms,
  sendVerification,
};
