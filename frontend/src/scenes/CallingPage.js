import React, { useCallback, useState, useEffect } from 'react';
import { Device } from 'twilio-client';
import * as Sentry from '@sentry/react';
import CallEndIcon from '@material-ui/icons/CallEnd';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router-dom';
import { useUserService, useContactService } from '../contexts';
import PATHS from './paths';
import Container from '../components/shared/Container';
import { makeCall, TransientIssueErrorCodes } from '../services/TwilioCall';

const EN_STRINGS = {
  CALLING_CONNECTING: 'Connecting...',
  CALLING_CONNECTED: 'Connected!',
  CALLING_CALL_FAILED: 'Call failed',
  CALLING_CALL_FINISHED: 'Call complete!',
  CALLING_NEED_MICROPHONE_ACCESS_MESSAGE:
    'Unable to make the call because the app does not have permissions to use your microphone. Please change your browser settings to allow us to use your microphone.',
  CALLING_TRANSIENT_ISSUE_MESSAGE:
    "We've experienced a temporary issue, please try again.",
  CALLING_UNSUPPORTED_BROWSER_MESSAGE:
    'Your browser is not supported. Try using Chrome or Safari',
};

const STRINGS = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
    CALLING_CONNECTING: 'সংযোজক',
    CALLING_CONNECTED: 'সংযুক্ত', // TODO Google translate
    CALLING_CALL_FAILED: 'কল ব্যর্থ হয়েছে',
  },
};

const CallEndButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.error.main,
    height: '5em',
    width: '5em',
    borderRadius: '1000px',
    color: 'white',
  },
}))(Button);

const USER_ACTIONABLE_TWILIO_ERROR_CODE_TO_ACTION_MESSAGE = {
  31003: 'CALLING_TRANSIENT_ISSUE_MESSAGE',
  31005: 'CALLING_TRANSIENT_ISSUE_MESSAGE',
  31009: 'CALLING_TRANSIENT_ISSUE_MESSAGE',
  31208: 'CALLING_NEED_MICROPHONE_ACCESS_MESSAGE',
};

export default function CallingPage({ locale }) {
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [wasCallSuccessful, setWasCallSuccessful] = useState(false);
  const [hasUserDisconnected, setHasUserDisconnected] = useState(false);
  const [activeConnection, setActiveConnection] = useState(null);
  const [lastErrorMessage, setLastErrorMessage] = useState(null);
  const [userState] = useUserService();
  const { me: user } = userState;
  const [contactState, contactService] = useContactService();
  const { activeContact } = contactState;

  const handleStatusChange = useCallback(() => {
    const status = Device.status();
    if (status === 'busy') {
      setIsConnected(true);
      setWasCallSuccessful(true);
    } else {
      setIsConnected(false);
    }
  }, [setIsConnected]);

  const subscribeToDeviceEvent = useCallback(
    (eventName) => {
      const listener = () => {
        console.log(eventName);
        handleStatusChange();
      };
      Device.on(eventName, listener);
      return () => {
        Device.removeListener(eventName, listener);
      };
    },
    [handleStatusChange]
  );

  useEffect(() => {
    return subscribeToDeviceEvent('connect');
  }, [subscribeToDeviceEvent]);

  useEffect(() => {
    return subscribeToDeviceEvent('disconnect');
  }, [subscribeToDeviceEvent]);

  useEffect(() => {
    return subscribeToDeviceEvent('offline');
  }, [subscribeToDeviceEvent]);

  // Errors don't seem to always correspond to status changes. We can capture these and if the calls 'fail' (however we detect that), we present messages to the user.
  useEffect(() => {
    const listener = (error) => {
      console.error('EROOORR', error);
      if (error.code && TransientIssueErrorCodes.has(error.code)) {
        return;
      }
      setLastErrorMessage(`${error.message}, (${error.code})`);
      Sentry.captureException(error);
      Sentry.captureException(error.twilioError);
    };
    Device.on('error', listener);
    return () => Device.removeListener('error', listener);
  }, [setLastErrorMessage]);

  useEffect(() => {
    (async () => {
      if (!activeContact) {
        return;
      }
      try {
        setHasAttemptedConnection(true);
        // TODO we can perform more sophisticated things with this connection like subscribe to updates
        const connection = await makeCall({
          userId: user.id,
          contactId: activeContact.id,
        });
        setActiveConnection(connection);
      } catch (error) {
        if (!Device.isSupported) {
          setLastErrorMessage(
            STRINGS[locale].CALLING_UNSUPPORTED_BROWSER_MESSAGE
          );
        } else if (
          error.code &&
          error.code in USER_ACTIONABLE_TWILIO_ERROR_CODE_TO_ACTION_MESSAGE
        ) {
          setLastErrorMessage(
            STRINGS[locale].CALLING_UNSUPPORTED_BROWSER_MESSAGE
          );
        } else {
          Sentry.captureException(error);
          setLastErrorMessage(`${error.message}, (${error.code})`);
        }
      }
    })();
  }, [user, activeContact]);

  const disconnectCall = useCallback(() => {
    if (activeConnection) {
      activeConnection.disconnect();
    }
    setHasUserDisconnected(true);
  }, [activeConnection]);

  const exitCallingPage = useCallback(() => {
    disconnectCall();
    contactService.setActiveContact(null);
  }, [contactService, disconnectCall]);

  if (!user) {
    return <Redirect to={PATHS.LOGIN} />;
  }
  if (!activeContact) {
    return <Redirect to={PATHS.CONTACTS} />;
  }

  const avatarUrl = `/images/avatars/${activeContact.avatar}.svg`;

  let connectionMessage;
  if (isConnected) {
    connectionMessage = STRINGS[locale].CALLING_CONNECTED;
  } else if (hasUserDisconnected) {
    connectionMessage = STRINGS[locale].CALLING_CALL_FINISHED;
  } else {
    connectionMessage = STRINGS[locale].CALLING_CONNECTING;
  }

  const DisconnectCallButton = (
    <CallEndButton variant="contained" onClick={disconnectCall}>
      <CallEndIcon />
    </CallEndButton>
  );

  const ExitPageButton = (
    <CallEndButton variant="contained" onClick={exitCallingPage}>
      <CloseIcon />
    </CallEndButton>
  );

  return (
    <Container>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            marginTop: '20%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            style={{ height: '16rem', width: '16rem' }}
            alt=""
            src={avatarUrl}
          />
          <Typography style={{ marginTop: '4rem' }} variant="h5" component="h2">
            {activeContact.name}
          </Typography>
          <Typography variant="body1">{connectionMessage}</Typography>
          {hasAttemptedConnection && lastErrorMessage && !wasCallSuccessful ? (
            <Typography variant="body1" color="error">
              There was an error. Please send a screenshot with this message:
              {lastErrorMessage}
            </Typography>
          ) : null}
        </div>
        {isConnected ? DisconnectCallButton : ExitPageButton}
      </div>
    </Container>
  );
}
