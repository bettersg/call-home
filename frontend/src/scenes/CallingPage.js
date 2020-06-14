import React, { useState, useEffect } from 'react';
import * as Twilio from 'twilio-client';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router-dom';
import { useUserService, useContactService } from '../contexts';
import PATHS from './paths';
import getToken from '../services/Calls';

const STRINGS = {
  en: {
    CALLING_CONNECTING: 'Connecting...',
    CALLING_CONNECTED: 'Connected!',
    CALLING_CALL_FAILED: 'Call failed',
  },
};

const CallEndButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.error,
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
      // TODO properly validate the user permissions for this
      const newToken = await getToken();
      setTwilioToken(newToken);
    })();
  }, []);

  useEffect(() => {
    if (!twilioToken) {
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
  }, [twilioToken]);

  useEffect(() => {
    if (isReady && !isConnected && activeContact) {
      device.connect({
        userId: user.id,
        contactId: activeContact.id,
      });
    }
  }, [isReady, isConnected, activeContact]);

  if (!user) {
    return <Redirect to={PATHS.LOGIN} />;
  }
  if (!activeContact) {
    return <Redirect to={PATHS.CONTACTS} />;
  }

  const navigateToContactPage = () => {
    contactService.setActiveContact(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Button onClick={navigateToContactPage}>Back</Button>
      <Typography variant="h5" component="h2">
        {activeContact.name}
      </Typography>
      <Typography variant="body1">
        {isConnected
          ? STRINGS[locale].CALLING_CONNECTED
          : STRINGS[locale].CALLING_CONNECTING}
      </Typography>
      <CallEndButton
        variant="contained"
        onClick={() => {
          device.disconnectAll();
        }}
      >
        <CallEndIcon />
      </CallEndButton>
    </div>
  );
}
