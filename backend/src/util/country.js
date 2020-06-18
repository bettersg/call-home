const twilio = require('twilio');

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const supportedCountries = new Set(['SG', 'BD']);

async function normalizePhoneNumber(phoneNumber, countryCodeIso) {
  if (!supportedCountries.has(countryCodeIso)) {
    throw new Error('Validation Error: COUNTRY_NOT_SUPOPRTED');
  }

  try {
    const twilioPhoneNumber = await twilioClient.lookups
      .phoneNumbers(phoneNumber)
      .fetch({ countryCode: countryCodeIso });
    console.log('Got twilio response', twilioPhoneNumber);
    return twilioPhoneNumber.phoneNumber;
  } catch (e) {
    if (e.status === 404) {
      throw new Error('Validation Error: INVALID_PHONE_NUMBER');
    }
  }
  return null;
}

module.exports = {
  normalizePhoneNumber,
};
