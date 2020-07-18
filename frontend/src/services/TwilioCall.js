import { Device } from 'twilio-client';
import { getLogger } from 'loglevel';
import getToken from './Calls';

// TODO handle production environments better
const isProd = process.env.NODE_ENV === 'production';
const twilioLogger = getLogger(Device.packageName);
twilioLogger.setLevel('trace');

const CALL_RETRY_COUNT = 3;
const TransientIssueErrorCodes = new Set([
  31003, // This happens when the connection is canceled e.g. by navigation
  31005, // Appears to be a transient issue when connecting to Twilio
  31009, // 'Transport not available -> the device seems to randomly error out'
  31205, // JWT expires. Not an issue, we will refresh it anyway.
]);

// Helper functions for performing Twilio calls. The goal of this is to abstract over some of the minor details of interacting with the Twilio device.
// This assumes that there is only one global device.

async function makeCallOnce(call) {
  if (!isProd) {
    return null;
  }

  // This has to be first because for some insane reason, you can't check the status before setting up the device.
  if (!Device.token) {
    const token = await getToken();
    Device.setup(token);
  }

  // If it is busy, assume we are in a call
  if (Device.status() === 'busy') {
    return Device.activeConnection();
  }

  // If it is offline, we attempt to reconnect.
  if (Device.status() === 'offline') {
    const token = await getToken();
    Device.setup(token);
  }

  return new Promise((resolve, reject) => {
    if (Device.status() === 'ready') {
      resolve(Device.connect(call));
      return;
    }

    const callWhenReady = () => {
      resolve(Device.connect(call));
    };

    // Could it be that the device is ready before the listener is attached?
    // Is this insane??
    Device.once('ready', callWhenReady);
    Device.on('error', reject);
  });
}

async function makeCall(call) {
  let lastError;

  for (let i = 0; i < CALL_RETRY_COUNT; i += 1) {
    try {
      // eslint-disable-next-line
      return await makeCallOnce(call);
    } catch (error) {
      if (!error.code || !TransientIssueErrorCodes.has(error.code)) {
        throw error;
      }
      lastError = error;
    }
  }

  throw lastError;
}
// TODO handle token retry, helper methods for Twilio connections

export { makeCall, TransientIssueErrorCodes };
