const {
  ENABLE_ALLOWLIST_SMS,
  DISABLE_ALLOWLIST,
  ENABLE_DORM_VALIDATION,
} = process.env;

function shouldEnableAllowlistSms(): boolean {
  return Boolean(ENABLE_ALLOWLIST_SMS);
}

function shouldDisableAllowlist(): boolean {
  return Boolean(DISABLE_ALLOWLIST);
}

function shouldEnableDormValidation(): boolean {
  return Boolean(ENABLE_DORM_VALIDATION);
}

type PeriodicCreditCohort = 'week' | 'month';

export {
  shouldDisableAllowlist,
  shouldEnableAllowlistSms,
  shouldEnableDormValidation,
};
