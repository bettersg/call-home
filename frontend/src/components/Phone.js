import React, { useState, useEffect } from 'react';
import * as Twilio from 'twilio-client';
// import _ from 'lodash';

function Phone({ token }) {
  const [device, setDevice] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (!token) {
      return;
    }
    console.log(token);
    const newDevice = new Twilio.Device();
    newDevice.setup(token);
    newDevice.on('ready', () => {
      setDevice(newDevice);
    });
  }, [token]);

  const dialNumber = () => {
    // connect makes the device talk back to the twilio app. your app then figures out what to do via TwiML and tells your frontend.
    device.connect({
      targetNumber: phoneNumber,
    });
  };

  if (!device) {
    return <div>Not Connected</div>;
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dialNumber();
      }}
    >
      <label htmlFor="phone-number-input">
        Who you gonna call
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          id="phone-number-input"
        />
      </label>
      <input type="submit" value="Call!" />
    </form>
  );
}

export default Phone;
