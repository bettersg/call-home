const {
  CALL_LIMITS_ENABLED_NUMBERS = '',
  ENABLE_CALL_LIMIT_ALL,
  ENABLE_ALLOWLIST_SMS,
  ENABLE_WORKPASS_VALIDATION_ALL,
  WORKPASS_VALIDATION_ENABLED_NUMBERS = '',
} = process.env;
const callLimitNumbers = CALL_LIMITS_ENABLED_NUMBERS.split(',').map(Number);
const workpassValidationNumbers = WORKPASS_VALIDATION_ENABLED_NUMBERS.split(
  ','
).map(Number);

// TODO remove this flag
function shouldEnableCallLimits(userId: number): boolean {
  return (
    Boolean(ENABLE_CALL_LIMIT_ALL) || callLimitNumbers.includes(Number(userId))
  );
}

function shouldEnableWorkpassValidation(userId: number): boolean {
  return (
    Boolean(ENABLE_WORKPASS_VALIDATION_ALL) ||
    workpassValidationNumbers.includes(userId)
  );
}

function shouldEnableAllowlistSms(): boolean {
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
  shouldEnableWorkpassValidation,
  getPeriodicCreditCohort,
  shouldEnableAllowlistSms,
};
