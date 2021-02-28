const { ENABLE_ALLOWLIST_SMS, DISABLE_ALLOWLIST } = process.env;

function shouldEnableAllowlistSms(): boolean {
  return Boolean(ENABLE_ALLOWLIST_SMS);
}

function shouldDisableAllowlist(): boolean {
  return Boolean(DISABLE_ALLOWLIST);
}

type PeriodicCreditCohort = 'week' | 'month';

export { shouldDisableAllowlist, shouldEnableAllowlistSms };
