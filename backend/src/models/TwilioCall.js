const { DataTypes, Model } = require('sequelize');

// Mirrors the Twilio Call REST API resource
// https://www.twilio.com/docs/voice/tutorials/how-to-modify-calls-in-progress-node-js
// Used to store the OUTGOING calls made by call home, not the incoming TwiML calls.
function TwilioCallModel(sequelize) {
  class TwilioCall extends Model {}
  TwilioCall.init(
    {
      // The twilio sid of the parent aka incoming TwiML call.
      // This will be the first column populated because it is the only information we have when the call is first made.
      // This will be used to respond to events or in the catch up jobs
      // This can be joined with Calls.incomingTwilioCallSid
      parentCallSid: {
        type: DataTypes.STRING,
        // We're going to assume that we only get one outgoing call per parent call.
        unique: true,
      },
      twilioSid: {
        type: DataTypes.STRING,
      },
      fromPhoneNumber: {
        type: DataTypes.STRING,
      },
      toPhoneNumber: {
        type: DataTypes.STRING,
      },
      // queued, ringing, in-progress, canceled, completed, failed, busy, no-answer
      status: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.STRING,
      },
      priceUnit: {
        type: DataTypes.STRING,
      },
      // This is our own field to determine the freshness of the data from the API
      lastUpdated: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'TwilioCall',
    }
  );
  return TwilioCall;
}

module.exports = TwilioCallModel;
