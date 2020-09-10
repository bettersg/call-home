import { Column, Table, Unique, Model } from 'sequelize-typescript';

// Mirrors the Twilio Call REST API resource
// https://www.twilio.com/docs/voice/tutorials/how-to-modify-calls-in-progress-node-js
// Used to store the OUTGOING calls made by call home, not the incoming TwiML calls.
@Table
class TwilioCall extends Model<TwilioCall> {
  // We're going to assume that we only get one outgoing call per parent call.
  @Unique
  @Column
  // The twilio sid of the parent aka incoming TwiML call.
  // This will be the first column populated because it is the only information we have when the call is first made.
  // This will be used to respond to events or in the catch up jobs
  // This can be joined with Calls.incomingTwilioCallSid
  parentCallSid: string;

  @Column
  twilioSid: string;

  @Column
  fromPhoneNumber: string;

  @Column
  toPhoneNumber: string;

  @Column
  // queued, ringing, in-progress, canceled, completed, failed, busy, no-answer
  status: string;

  @Column
  price: string;

  @Column
  priceUnit: string;

  @Column
  // Duration in seconds.
  duration: number;

  @Column
  // This is our own field to determine the freshness of the data from the API
  lastUpdated: Date;
}

export default TwilioCall;
