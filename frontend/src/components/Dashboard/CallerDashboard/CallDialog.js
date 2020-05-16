import Dialog from '@material-ui/core/Dialog';
import React, { useState, useEffect } from 'react';
import * as Twilio from 'twilio-client';
import Typography from '@material-ui/core/Typography';
import CallEndIcon from '@material-ui/icons/CallEnd';
import RoundedButton from '../../shared/RoundedButton';

import getToken from '../../../services/Calls';
import './CallDialog.css';

const connectedProps = {
  // is using 'bools' as keys a bad idea?
  true: {
    imgSrc: '/images/call_connected.svg',
    statusMessage: 'Connected',
  },
  false: {
    imgSrc: '/images/call_connecting.svg',
    statusMessage: 'Calling',
  },
};

function CallDialog({ call, disconnectCall }) {
  const [twilioToken, setTwilioToken] = useState(null);
  const [device] = useState(new Twilio.Device());
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
      console.error('EROOORR', e);
    });

    device.on('ready', () => {
      console.log('set up device');
    });

    device.on('connect', () => {
      setIsConnected(true);
    });

    device.on('disconnect', () => {
      disconnectCall();
      setIsConnected(false);
    });
  }, [twilioToken]);

  useEffect(() => {
    if (!call && isConnected) {
      device.disconnectAll();
    } else if (call && !isConnected) {
      device.connect(call);
    }
    // TODO add effect cleanup
  }, [call, isConnected]);

  if (!call) {
    return null;
  }

  return (
    <Dialog open={Boolean(call)}>
      <div className="call-dialog-content">
        <img
          alt=""
          className="call-uncle-image"
          src={connectedProps[isConnected].imgSrc}
        />
        <div>
          <Typography variant="subtitle1" color="textSecondary">
            {connectedProps[isConnected].statusMessage}
          </Typography>
          <Typography variant="h4">{call.calleeName}</Typography>
        </div>
        <RoundedButton
          variant="contained"
          color="primary"
          onClick={() => disconnectCall()}
        >
          <CallEndIcon />
          End Call
        </RoundedButton>
      </div>
    </Dialog>
  );
}

export default CallDialog;
