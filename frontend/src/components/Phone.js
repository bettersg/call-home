import React, { useState, useEffect } from 'react';
import * as Twilio from 'twilio-client';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import CallEndIcon from '@material-ui/icons/CallEnd';
import getToken from '../services/Calls';

function Phone({ call, calleeName, disconnectCall }) {
  const [twilioToken, setTwilioToken] = useState(null);
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    (async () => {
      const newToken = await getToken();
      setTwilioToken(newToken);
    })();
  }, []);

  useEffect(() => {
    if (!twilioToken) {
      return;
    }
    const newDevice = new Twilio.Device();
    console.log('setting up device');
    newDevice.setup(twilioToken);

    newDevice.on('error', (e) => {
      console.error('EROOORR', e);
    });

    newDevice.on('ready', () => {
      console.log('set up device');
      setDevice(newDevice);
    });

    newDevice.on('connect', () => {
      setIsConnected(true);
    });

    newDevice.on('disconnect', () => {
      disconnectCall();
      setIsConnected(false);
    });
  }, [twilioToken]);

  useEffect(() => {
    if (!device) {
      return;
    }
    if (!call) {
      device.disconnectAll();
      return;
    }
    device.connect(call);
    // TODO add effect cleanup
  }, [device, call]);

  if (!device) {
    return <div>Not Connected</div>;
  }

  if (!call) {
    return <div>You are not in a call</div>;
  }

  if (!isConnected) {
    return <div>Trying to call to {calleeName}</div>;
  }

  return (
    <>
      <Typography variant="subtitle2">Connected to {calleeName}!!</Typography>
      <Button
        onClick={() => device.disconnectAll()}
        variant="contained"
        style={{ color: 'white', background: red[500] }}
      >
        <CallEndIcon />
      </Button>
    </>
  );
}

export default Phone;
