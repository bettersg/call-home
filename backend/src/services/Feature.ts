const { CALL_LIMITS_ENABLED_NUMBERS = '', CALL_LIMIT_ONBOARDING } = process.env;
const callLimitNumbers = CALL_LIMITS_ENABLED_NUMBERS.split(',').map(Number);

function shouldEnableCallLimits(userId: number) {
  return callLimitNumbers.includes(Number(userId));
}

function shouldShowCallLimitOnboarding() {
  return Boolean(CALL_LIMIT_ONBOARDING);
}

export { shouldEnableCallLimits, shouldShowCallLimitOnboarding };
