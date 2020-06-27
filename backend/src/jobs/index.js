const services = require('../services');
const refreshConnectedCalls = require('./refreshConnectedCalls');

const { TwilioCall, TwilioClient } = services;

console.log('Initializing jobs');

refreshConnectedCalls(TwilioCall, TwilioClient);
