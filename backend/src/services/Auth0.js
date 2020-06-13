const axios = require('axios');

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET } = process.env;

const AUTH0_HOST = `https://${AUTH0_DOMAIN}`;

function Auth0Service() {
  const auth0Args = {
    // domain: AUTH0_DOMAIN,
    client_id: AUTH0_CLIENT_ID,
    client_secret: AUTH0_CLIENT_SECRET,
  };

  async function sendSms(phoneNumber) {
    const response = await axios.post(`${AUTH0_HOST}/passwordless/start`, {
      ...auth0Args,
      phone_number: phoneNumber,
      connection: 'sms',
    });
    return response.data;
  }

  async function signIn(phoneNumber, code) {
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
  }

  return {
    sendSms,
    signIn,
  };
}

module.exports = Auth0Service;
