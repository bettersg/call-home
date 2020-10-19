const {
  CALL_LIMITS_ENABLED_NUMBERS = '',
  ENABLE_CALL_LIMIT_ALL,
  CALL_LIMIT_ONBOARDING,
} = process.env;
const callLimitNumbers = CALL_LIMITS_ENABLED_NUMBERS.split(',').map(Number);

function shouldEnableCallLimits(userId: number) {
  return ENABLE_CALL_LIMIT_ALL || callLimitNumbers.includes(Number(userId));
}

function shouldShowCallLimitOnboarding() {
  return Boolean(CALL_LIMIT_ONBOARDING);
}

export { shouldEnableCallLimits, shouldShowCallLimitOnboarding };
