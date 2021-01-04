const { ENABLE_ALLOWLIST_SMS, DISABLE_ALLOWLIST } = process.env;

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
  getPeriodicCreditCohort,
  shouldDisableAllowlist,
  shouldEnableAllowlistSms,
};
