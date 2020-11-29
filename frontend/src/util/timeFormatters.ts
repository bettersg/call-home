import { Duration } from 'luxon';

type FormattableUnit = 'days' | 'hours' | 'minutes' | 'seconds';
// UGLY
const durationUnitsDesc: FormattableUnit[] = [
  'days',
  'hours',
  'minutes',
  'seconds',
];
const durationUnitsConfig = {
  days: {
    formatToken: 'd',
    singular: 'day',
  },
  hours: {
    formatToken: 'h',
    singular: 'hour',
  },
  minutes: {
    formatToken: 'm',
    singular: 'minute',
  },
  seconds: {
    formatToken: 's',
    singular: 'second',
  },
};

function humanReadableFormatString(
  duration: Duration,
  minUnit: FormattableUnit | null = null
): string {
  let unitsToUse: FormattableUnit[] = durationUnitsDesc;
  if (minUnit) {
    const lastIndex = durationUnitsDesc.indexOf(minUnit);
    unitsToUse = durationUnitsDesc.slice(0, lastIndex + 1);
  }

  const nonzeroFormatString = unitsToUse
    .map((unit) => [unit, duration[unit]] as const)
    .filter(([, unitAmount]) => unitAmount)
    .map(([unit, unitAmount]) => {
      const { formatToken, singular } = durationUnitsConfig[unit];
      return `${formatToken} '${
        Math.abs(Math.floor(unitAmount)) === 1 ? singular : unit
      }'`;
    })
    .join(' ');
  if (nonzeroFormatString) {
    return nonzeroFormatString;
  }
  const lastUnit = unitsToUse[unitsToUse.length - 1];
  const { formatToken } = durationUnitsConfig[lastUnit];
  return `${formatToken} '${lastUnit}'`;
}

function formatNegativeDuration(
  duration: Duration,
  formatString: string
): string {
  const isNegative = duration.as('seconds') < 0;
  const positiveDuration = isNegative ? duration.negate() : duration;
  const positiveFormat = positiveDuration.toFormat(formatString);
  return isNegative ? `- ${positiveFormat}` : positiveFormat;
}

function formatDurationInDaysHoursMinutes(rawDuration: Duration): string {
  const duration = rawDuration.shiftTo('days', 'hours', 'minutes');
  // If there is a days component, we show only up to hours
  // Otherwise, show up to minutes
  const formatString =
    duration.days > 0
      ? humanReadableFormatString(duration, 'hours')
      : humanReadableFormatString(duration, 'minutes');
  return formatNegativeDuration(duration, formatString);
}

function formatCallTime(rawDuration: Duration): string {
  const duration = rawDuration.shiftTo('hours', 'minutes', 'seconds');
  const formatString = duration.hours > 0 ? 'hh:mm:ss' : 'mm:ss';
  return duration.toFormat(formatString);
}

function formatDurationInHoursMinutes(rawDuration: Duration): string {
  const duration = rawDuration.shiftTo('hours', 'minutes');
  const formatString = humanReadableFormatString(duration, 'minutes');
  return formatNegativeDuration(duration, formatString);
}

// TODO figure out how to name these consistently
function formatSecondsWithHours(seconds: number): string {
  return Duration.fromObject({ seconds }).toFormat(
    "hh 'hours' mm 'minutes' ss 'seconds'"
  );
}

export {
  formatCallTime,
  formatDurationInHoursMinutes,
  formatSecondsWithHours,
  formatDurationInDaysHoursMinutes,
};
