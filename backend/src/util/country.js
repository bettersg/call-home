const countryAbbrevToCallingCode = {
  sg: '+65',
  bd: '+880',
  in: '+91',
};

// Prepend the country code and remove non numerics.
function normalizePhoneNumber(phoneNumber, countryAbbrev) {
  const callingCode = countryAbbrevToCallingCode[countryAbbrev];
  if (phoneNumber.startsWith('+') && !phoneNumber.startsWith(callingCode)) {
    throw new Error('Invalid country code');
  }
  const noCallingCode = phoneNumber.replace(callingCode, '');
  return `${callingCode}${noCallingCode.replace(/\D/g, '')}`;
}

module.exports = {
  countryAbbrevToCallingCode,
  normalizePhoneNumber,
};
