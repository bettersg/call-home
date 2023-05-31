import * as Sentry from '@sentry/react';
import { Call as TwilioSdkCall, Device } from '@twilio/voice-sdk';
// TODO for some reason, this file requires using the dist/ directory
import { Edge } from '@call-home/shared/types/CallExperimentFlags';
import { getLogger } from 'loglevel';
import getToken from './CallToken';

interface Call extends Record<string, string> {
  userId: string;
  contactId: string;
}
// TODO handle production environments better
const isProd = true;
const twilioLogger = getLogger(Device.packageName);
twilioLogger.setLevel('trace');

const CALL_RETRY_COUNT = 3;
const TransientIssueErrorCodes = new Set([
  // These have been confirmed by Twilio support to be caused by network issues.
  31003, // This happens when the connection is canceled e.g. by navigation
  31005, // Appears to be a transient issue when connecting to Twilio
  31009, // 'Transport not available -> the device seems to randomly error out'

  // These are from our own observation.
  // 31002, // Authentication in progress. Twilio support says that this may be due to errors in the backend, we should investigate this further.
  31204, // Unable to validate token -> is the token invalid? dk if this is a problem or not. Probably only solved by destroying the device
  31205, // JWT expires. Not an issue, we will refresh it anyway.
]);

interface CallMetadata {
  numSamples: number;
  avgMos: number;
}

const twilioCalls = new WeakMap<TwilioSdkCall, CallMetadata>();

// Helper functions for performing Twilio calls. The goal of this is to abstract over some of the minor details of interacting with the Twilio device.
// This assumes that there is only one global device.

const SETUP_OPTIONS: Device.Options = {};

function getEdgeOption(edgeFlag: Edge) {
  switch (edgeFlag) {
    case Edge.SINGAPORE_ONLY:
      return { edge: 'singapore' };
    case Edge.SINGAPORE_ROAMING:
      return { edge: ['singapore', 'roaming'] };
    case Edge.DEFAULT:
    default:
      return {};
  }
}

function isTransientIssue(error: any) {
  const { code } = error;
  if (TransientIssueErrorCodes.has(code)) {
    return true;
  }
  if (code === 31000 && error.message === 'Call is no longer valid') {
    return true;
  }
  return false;
}

function onSample(twilioSdkCall: TwilioSdkCall) {
  return (sampleEvent: TwilioSdkCall.CallMetrics) => {
    const callMetadata = twilioCalls.get(twilioSdkCall);
    const { mos: newMos } = sampleEvent;
    if (!callMetadata || !newMos) {
      return;
    }

    const { avgMos, numSamples } = callMetadata;
    callMetadata.avgMos = (numSamples * avgMos + newMos) / (numSamples + 1);
    callMetadata.numSamples += 1;
  };
}

async function makeCallOnce(
  call: Call,
  edgeFlag: Edge
): Promise<{
  device: Device;
  twilioSdkCall: TwilioSdkCall;
} | null> {
  if (!isProd) {
    return null;
  }

  const token = await getToken();
  const device = new Device(token, {
    ...SETUP_OPTIONS,
    ...getEdgeOption(edgeFlag),
  });

  const twilioSdkCall = await device.connect({
    params: call,
  });

  Sentry.addBreadcrumb({
    category: 'twilio',
    data: {
      twilioSdkCall,
    },
  });

  return new Promise((resolve, reject) => {
    twilioSdkCall.on('ringing', () => resolve({ device, twilioSdkCall }));
    twilioSdkCall.on('sample', onSample(twilioSdkCall));
    device.once('error', reject);
    twilioCalls.set(twilioSdkCall, {
      numSamples: 0,
      avgMos: 0,
    });
  });
}

async function makeCall(call: Call, edgeFlag: Edge) {
  let lastError;

  for (let i = 0; i < CALL_RETRY_COUNT; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await makeCallOnce(call, edgeFlag);
    } catch (error) {
      if (!error.code || !TransientIssueErrorCodes.has(error.code)) {
        throw error;
      }
      lastError = error;
    }
  }

  throw lastError;
}

function getAvgMos(twilioSdkCall: TwilioSdkCall): number | undefined {
  // See call quality section for more info on mos
  // https://www.twilio.com/docs/voice/sdks/javascript/twiliopreflighttest#report
  return twilioCalls.get(twilioSdkCall)?.avgMos;
}

export { makeCall, isTransientIssue, getAvgMos };
