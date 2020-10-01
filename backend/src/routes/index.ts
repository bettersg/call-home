import Call from './Call';
import CallToken from './CallToken';

import * as services from '../services';
import Twilio from './Twilio';
import * as middlewares from './middlewares';
import User from './User';
import Contact = require('./Contact');
import OAuth = require('./OAuth');
import AllowlistEntry = require('./AllowlistEntry');
import Passwordless = require('./Passwordless');

const callRoute = Call(services.Call, services.TwilioCall);
const callTokenRoute = CallToken();
const twilioRoute = Twilio(services.Call, services.TwilioCall);
const oAuthRoute = OAuth();
const passwordlessRoute = Passwordless(
  services.User,
  services.Auth0,
  services.PasswordlessRequest
);
const userRoute = User(services.User, services.Wallet);
const contactRoute = Contact(services.Contact);
const allowlistEntryRoute = AllowlistEntry(services.AllowlistEntry);

export {
  callRoute as Call,
  callTokenRoute as CallToken,
  twilioRoute as Twilio,
  oAuthRoute as OAuth,
  passwordlessRoute as Passwordless,
  userRoute as User,
  contactRoute as Contact,
  allowlistEntryRoute as AllowlistEntry,
  middlewares,
};
