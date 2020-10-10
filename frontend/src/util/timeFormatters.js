import { Duration } from 'luxon';

// UGLY
const durationUnitsDesc = ['days', 'hours', 'minutes', 'seconds'];
const durationUnitsConfig = {
  days: {
    formatToken: 'dd',
    singular: 'day',
  },
  hours: {
    formatToken: 'hh',
    singular: 'hour',
  },
  minutes: {
    formatToken: 'mm',
    singular: 'minute',
  },
  seconds: {
    formatToken: 'ss',
    singular: 'second',
  },
};

function humanReadableFormatString(duration, minUnit = null) {
  let unitsToUse = durationUnitsDesc;
  if (minUnit) {
    const lastIndex = durationUnitsDesc.indexOf(minUnit);
    unitsToUse = durationUnitsDesc.slice(0, lastIndex + 1);
  }

  return unitsToUse
    .map((unit) => [unit, duration[unit]])
    .filter(([, unitAmount]) => unitAmount)
    .map(([unit, unitAmount]) => {
      const { formatToken, singular } = durationUnitsConfig[unit];
      return `${formatToken} '${Math.floor(unitAmount) > 1 ? unit : singular}'`;
    })
    .join(' ');
}

function formatDurationInDaysHoursMinutes(rawDuration) {
  const duration = rawDuration.shiftTo('days', 'hours', 'minutes');
  // If there is a days component, we show only up to hours
  // Otherwise, show up to minutes
  const formatString =
    duration.days > 0
      ? humanReadableFormatString(duration, 'hours')
      : humanReadableFormatString(duration, 'minutes');
  return duration.toFormat(formatString);
}

// TODO figure out how to name these consistently
function formatSecondsWithHours(seconds) {
  return Duration.fromObject({ seconds }).toFormat(
    "hh 'hours' mm 'minutes' ss 'seconds'"
  );
}

function formatSecondsInHoursMinutes(seconds) {
  const duration = Duration.fromObject({ seconds }).shiftTo('hours', 'minutes');
  const formatString = humanReadableFormatString(duration);
  return duration.toFormat(formatString);
}

export {
  formatSecondsInHoursMinutes,
  formatSecondsWithHours,
  formatDurationInDaysHoursMinutes,
};
