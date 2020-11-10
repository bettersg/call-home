const {
  CALL_LIMITS_ENABLED_NUMBERS = '',
  ENABLE_CALL_LIMIT_ALL,
  ENABLE_ALLOWLIST_SMS,
} = process.env;
const callLimitNumbers = CALL_LIMITS_ENABLED_NUMBERS.split(',').map(Number);

function shouldEnableCallLimits(userId: number) {
  return ENABLE_CALL_LIMIT_ALL || callLimitNumbers.includes(Number(userId));
}

function shouldEnableAllowlistSms() {
  return Boolean(ENABLE_ALLOWLIST_SMS);
}

type PeriodicCreditCohort = 'week' | 'month';

// TODO To keep the flags clean and consistent, this should just take a user Id. This is a workaround to reduce the effort needed.
// Returns which cohort to use for the periodic credit feature
// Even phone numbers get 'week' and odd ones get 'month'
function getPeriodicCreditCohort(
  userPhoneNumber: string
): PeriodicCreditCohort {
  const phoneNumberMod2 =
    Number(userPhoneNumber[userPhoneNumber.length - 1]) % 2;
  // We'll treat NaN as odd.
  const isEven = phoneNumberMod2 === 0;
  return isEven ? 'week' : 'month';
}

export {
  shouldEnableCallLimits,
  getPeriodicCreditCohort,
  shouldEnableAllowlistSms,
};
