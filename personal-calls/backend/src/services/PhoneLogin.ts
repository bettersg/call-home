import axios from 'axios';
import type { Feature, TwilioClient } from '.';

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET } = process.env;

const AUTH0_HOST = `https://${AUTH0_DOMAIN}`;

interface PhoneLoginService {
  sendSms: (phoneNumber: string) => Promise<unknown>;
  signIn: (phoneNumber: string, code: string) => Promise<unknown>;
}

// TODO a better separation of concerns would move the Auth0 stuff into its own
// module, but this is going to go away soon anyway.
function Auth0(): PhoneLoginService {
  const auth0Args = {
    // domain: AUTH0_DOMAIN,
    client_id: AUTH0_CLIENT_ID,
    client_secret: AUTH0_CLIENT_SECRET,
  };

  async function sendSms(phoneNumber: string): Promise<unknown> {
    const response = await axios.post(`${AUTH0_HOST}/passwordless/start`, {
      ...auth0Args,
      phone_number: phoneNumber,
      connection: 'sms',
    });
    return response.data;
  }

  async function signIn(phoneNumber: string, code: string): Promise<unknown> {
    try {
      const response = await axios.post(`${AUTH0_HOST}/oauth/token`, {
        ...auth0Args,
        connection: 'sms',
        grant_type: 'http://auth0.com/oauth/grant-type/passwordless/otp',
        scope: 'openid',
        realm: 'sms',
        username: phoneNumber,
        otp: code,
      });
      return response.data;
    } catch (e) {
      if (e.response?.data?.error === 'invalid_grant') {
        throw new Error('BAD_OTP');
      }
      throw new Error('UNKNOWN_ERROR');
    }
  }

  return {
    sendSms,
    signIn,
  };
}

function TwilioVerify(twilioClient: typeof TwilioClient): PhoneLoginService {
  return {
    sendSms: (phoneNumber: string) =>
      twilioClient.sendVerification(phoneNumber),
    signIn: (phoneNumber: string, code: string) =>
      twilioClient.checkVerification(phoneNumber, code),
  };
}

export default function PhoneLoginServce(
  feature: typeof Feature,
  twilioClient: typeof TwilioClient,
) {
  if (feature.shouldEnableTwilioVerify()) {
    return TwilioVerify(twilioClient);
  }
  return Auth0();
}
