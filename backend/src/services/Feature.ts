const { CALL_LIMITS_ENABLED_NUMBERS = '' } = process.env;
const callLimitNumbers = CALL_LIMITS_ENABLED_NUMBERS.split(',').map(Number);

function shouldEnableCallLimits(userId: number) {
  return callLimitNumbers.includes(userId);
}

export { shouldEnableCallLimits };
