// TODO move the API clients somewhere else
import twilio from 'twilio';
import { CredentialSets } from './TwilioCreds';
import type { CallType } from '../models';

const { TWILIO_SMS_PHONE_NUMBER } = process.env;

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

export { getCall, getCallsByIncomingSid, sendSms, postCallFeedback };
