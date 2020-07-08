import React, { useState, useEffect } from 'react';
import * as Twilio from 'twilio-client';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router-dom';
import { useUserService, useContactService } from '../contexts';
import PATHS from './paths';
import Container from '../components/shared/Container';
import getToken from '../services/Calls';

// TODO handle production environments better
const isProd = process.env.NODE_ENV === 'production';

const EN_STRINGS = {
  CALLING_CONNECTING: 'Connecting...',
  CALLING_CONNECTED: 'Connected!',
  CALLING_CALL_FAILED: 'Call failed',
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

export default function CallingPage({ locale }) {
  const [twilioToken, setTwilioToken] = useState(null);
  const [device] = useState(new Twilio.Device());
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userState] = useUserService();
  const { me: user } = userState;
  const [contactState, contactService] = useContactService();
  const { activeContact } = contactState;

  useEffect(() => {
    (async () => {
      if (isProd) {
        // TODO the token endpoint needs authz on the application side
        // the client should pass the intended contact, the backend verifies and then returns the twilio token and our own token
        // the client can then use the twilio token to init the device and then exchange our token for the call
        const newToken = await getToken();
        setTwilioToken(newToken);
      }
    })();
  }, []);

  useEffect(() => {
    if (!twilioToken) {
      if (!isProd) {
        setIsReady(true);
      }
      return;
    }
    console.log('setting up device');
    try {
      device.setup(twilioToken);
    } catch (e) {
      setIsConnected(false);
      throw new Error(
        'We were unable to set up the phone connection. Make sure that the website starts with https. If the problem persists, contact an admin'
      );
    }

    device.on('error', (e) => {
      setIsReady(false);
      console.error('EROOORR', e);
    });

    device.on('ready', () => {
      setIsReady(true);
      console.log('set up device');
    });

    device.on('connect', () => {
      console.log('connected');
      setIsConnected(true);
    });

    device.on('disconnect', () => {
      console.log('disconnected');
      setIsConnected(false);
      contactService.setActiveContact(null);
    });
  }, [device, user, twilioToken, contactService]);

  useEffect(() => {
    if (isReady && !isConnected && activeContact && isProd) {
      device.connect({
        userId: user.id,
        contactId: activeContact.id,
      });
    }
  }, [device, user, isReady, isConnected, activeContact]);

  if (!user) {
    return <Redirect to={PATHS.LOGIN} />;
  }
  if (!activeContact) {
    return <Redirect to={PATHS.CONTACTS} />;
  }

  const avatarUrl = `/images/avatars/${activeContact.avatar}.svg`;

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
          <Typography variant="body1">
            {isConnected
              ? STRINGS[locale].CALLING_CONNECTED
              : STRINGS[locale].CALLING_CONNECTING}
          </Typography>
        </div>
        <CallEndButton
          variant="contained"
          onClick={() => {
            device.disconnectAll();
          }}
        >
          <CallEndIcon />
        </CallEndButton>
      </div>
    </Container>
  );
}
