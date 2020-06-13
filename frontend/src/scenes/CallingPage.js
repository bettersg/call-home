import React, { useState, useEffect } from 'react';
import * as Twilio from 'twilio-client';
import CallEndIcon from '@material-ui/icons/CallEnd';
import RoundedButton from '../components/shared/RoundedButton';
import { useUserService, useContactService } from '../contexts';
import SCENES from './enums';
import getToken from '../services/Calls';

export default function CallingPage({ navigate }) {
  const [twilioToken, setTwilioToken] = useState(null);
  const [device] = useState(new Twilio.Device());
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userState] = useUserService();
  const { me: user } = userState;
  const [contactState, contactService] = useContactService();
  const { activeContact } = contactState;

  useEffect(() => {
    if (!user) {
      navigate(SCENES.LOGIN);
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      const newToken = await getToken();
      setTwilioToken(newToken);
    })();
  }, []);

  useEffect(() => {
    console.log('getting token', twilioToken);
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
      setIsConnected(true);
    });

    device.on('disconnect', () => {
      setIsConnected(false);
      // If we disconnect, we assume that something has happened and we need to stop
      setIsReady(false);
      contactService.setActiveContact(null);
    });
  }, [twilioToken]);

  useEffect(() => {
    console.log('trying to connect', isConnected, activeContact);
    if (isReady && !isConnected && activeContact) {
      device.connect({
        userId: user.id,
        contactId: activeContact.id,
      });
    }
  }, [isReady, isConnected, activeContact]);

  const navigateToContactPage = () => {
    contactService.setActiveContact(null);
    navigate(SCENES.CONTACTS_PAGE);
  };

  return (
    <div>
      <RoundedButton onClick={navigateToContactPage}>Back</RoundedButton>
      {activeContact ? <div>Calling {activeContact.name}</div> : 'Error'}
      {isConnected ? 'Connected!' : 'Connecting'}
      <RoundedButton
        variant="contained"
        color="primary"
        onClick={() => device.disconnectAll()}
      >
        <CallEndIcon />
        End Call
      </RoundedButton>
    </div>
  );
}
