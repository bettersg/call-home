import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { withStyles } from 'hack/withStyles';
import Box from '@mui/material/Box';
import { DateTime } from 'luxon';
import { Container } from 'components';
import { getRecentCalls, RecentCall } from '../services/Call';
import { useUserService } from '../contexts';
import PATHS from './paths';

const EN_STRINGS = {
  RECENT_TITLE: 'Recent Calls',
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
};

const STRINGS: Record<string, typeof EN_STRINGS> = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
  },
};

function formatCallDuration(seconds: number) {
  if (!seconds) {
    return 'NA';
  }
  const fullMinutes = Math.trunc(seconds / 60);
  const fullSeconds = seconds % 60;
  const minutesText = `${fullMinutes} ${
    fullMinutes === 1 ? 'minute' : 'minutes'
  }`;
  const secondsText = `${fullSeconds} ${
    fullSeconds === 1 ? 'second' : 'seconds'
  }`;
  return `${fullMinutes ? minutesText : ''}${
    fullSeconds ? ` ${secondsText}` : ' '
  }`;
}

const RecentCallsBox = withStyles({
  backgroundColor: 'white',
  border: '1px solid',
  borderColor: 'grey.200',
})(Box);

function prettyFormatDate(date: string, locale: string) {
  const dateObj = DateTime.fromISO(date);
  const today = DateTime.fromJSDate(new Date());
  const yesterday = today.minus({ days: 1 });
  if (dateObj.startOf('day').toISODate() === today.startOf('day').toISODate()) {
    return STRINGS[locale].TODAY;
  }
  if (
    dateObj.startOf('day').toISODate() === yesterday.startOf('day').toISODate()
  ) {
    return STRINGS[locale].YESTERDAY;
  }
  return dateObj.toFormat('dd MMM yyyy');
}

function CallCard({ call, locale }: { call: RecentCall; locale: string }) {
  const durationText = formatCallDuration(call.duration);
  return (
    <RecentCallsBox
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '4em',
      }}
    >
      <img
        style={{
          height: '2.5rem',
          width: '2.5rem',
          marginRight: '8px',
          marginLeft: '8px',
        }}
        alt=""
        src={`/images/avatars/${call.avatar || 'placeholder'}.svg`}
      />
      <div style={{ width: '100%', marginRight: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>{call.name}</Typography>
          <Typography>{prettyFormatDate(call.startTime, locale)}</Typography>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.675rem',
          }}
        >
          <Typography variant="body2">{call.phoneNumber}</Typography>
          <Typography variant="body2">{durationText}</Typography>
        </div>
      </div>
    </RecentCallsBox>
  );
}

function CallCards({ calls, locale }: { calls: RecentCall[]; locale: string }) {
  return (
    <div style={{ backgroundColor: 'white', overflow: 'scroll' }}>
      {calls.map((call) => {
        return <CallCard key={call.id} call={call} locale={locale} />;
      })}
    </div>
  );
}

function BackButton() {
  return (
    <Link to={PATHS.HOME} style={{ textDecoration: 'none' }}>
      <Typography
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ChevronLeftIcon />
        back
      </Typography>
    </Link>
  );
}

export default function RecentCallsPage({
  locale,
}: {
  locale: string;
}): React.ReactElement {
  const [userState, userService] = useUserService();
  const { me: user } = userState || {};
  const [userId, setUserId] = useState<string>();
  const [calls, setCalls] = useState<RecentCall[]>([]);

  // Seems like user info is not persisting and requires getting data from endpoint again
  useEffect(() => {
    if (userService) {
      userService.refreshSelf();
    }
  }, [userService]);
  useEffect(() => {
    if (userId) {
      getRecentCalls(userId).then((recentCalls: RecentCall[]) =>
        setCalls(recentCalls)
      );
    }
  }, [userId]);

  useEffect(() => {
    if (user) {
      setUserId(String(user.id));
    }
  }, [user]);

  return (
    <Container
      style={{
        background: 'no-repeat url(/images/contacts_bg.svg) bottom center',
        backgroundSize: 'contain',
      }}
    >
      <BackButton />
      <Typography
        variant="h5"
        component="h1"
        style={{
          marginBottom: '12px',
          fontWeight: 700,
        }}
      >
        {STRINGS[locale].RECENT_TITLE}
      </Typography>
      <CallCards calls={calls} locale={locale} />
    </Container>
  );
}
