const {
  ENABLE_ALLOWLIST_SMS,
  DISABLE_ALLOWLIST,
  ENABLE_DORM_VALIDATION,
  DISABLE_PERIODIC_JOBS,
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

// Allows periodic jobs to be disabled. Might be necessary to prevent multiple instances from writing to the same database.
function shouldDisablePeriodicJobs(): boolean {
  return Boolean(DISABLE_PERIODIC_JOBS);
}

type PeriodicCreditCohort = 'week' | 'month';

export {
  shouldDisableAllowlist,
  shouldEnableAllowlistSms,
  shouldEnableDormValidation,
  shouldDisablePeriodicJobs,
};
