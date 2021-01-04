const {
  ENABLE_ALLOWLIST_SMS,
  ENABLE_WORKPASS_VALIDATION_ALL,
  ENABLE_WORKPASS_VALIDATION_SCREEN,
  WORKPASS_VALIDATION_ENABLED_NUMBERS = '',
  ENABLE_WORKPASS_VALIDATION_NEW_USERS,
  ENABLE_WORKPASS_NEW_USER_CUT_OFF = 0,
  DISABLE_ALLOWLIST,
} = process.env;
const workpassValidationNumbers = WORKPASS_VALIDATION_ENABLED_NUMBERS.split(
  ','
).map(Number);
const enableWorkpassNewUserCutOff =
  Number(ENABLE_WORKPASS_NEW_USER_CUT_OFF) || 0;

function shouldEnableWorkpassValidation(userId: number): boolean {
  if (ENABLE_WORKPASS_VALIDATION_ALL) {
    return true;
  }
  if (workpassValidationNumbers.includes(userId)) {
    return true;
  }
  return (
    Boolean(ENABLE_WORKPASS_VALIDATION_NEW_USERS) &&
    Boolean(enableWorkpassNewUserCutOff) &&
    userId >= enableWorkpassNewUserCutOff
  );
}

function shouldEnableWorkpassValidationScreen(userId: number): boolean {
  return (
    shouldEnableWorkpassValidation(userId) ||
    Boolean(ENABLE_WORKPASS_VALIDATION_SCREEN)
  );
}

function shouldEnableAllowlistSms(): boolean {
  return Boolean(ENABLE_ALLOWLIST_SMS);
}

function shouldDisableAllowlist(): boolean {
  return Boolean(DISABLE_ALLOWLIST);
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
  shouldEnableWorkpassValidation,
  shouldEnableWorkpassValidationScreen,
  getPeriodicCreditCohort,
  shouldDisableAllowlist,
  shouldEnableAllowlistSms,
};
