import Call from './Call';
import CallToken from './CallToken';

import * as services from '../services';
import Twilio from './Twilio';
import * as middlewares from './middlewares';
import Feature from './Feature';
import User from './User';
import Transaction from './Transaction';
import PeriodicCredit from './PeriodicCredit';
import Contact from './Contact';
import AllowlistEntry from './AllowlistEntry';
import PhoneNumberValidation from './PhoneNumberValidation';
import OAuth = require('./OAuth');

const callRoute = Call(services.Call, services.TwilioCall);
const callTokenRoute = CallToken();
const twilioRoute = Twilio(services.Call, services.TwilioCall);
const oAuthRoute = OAuth();
const phoneNumberValidationRoute = PhoneNumberValidation(
  services.User,
  services.Auth0,
  services.PhoneNumberValidation
);
const userRoute = User(
  services.User,
  services.PeriodicCredit,
  services.PhoneNumberValidation,
  services.Wallet
);
const contactRoute = Contact(services.Contact);
const allowlistEntryRoute = AllowlistEntry(services.AllowlistEntry);
const transactionRoute = Transaction(services.Transaction);
const featureRoute = Feature(services.Feature);
const periodicCreditRoute = PeriodicCredit(services.PeriodicCredit);

export {
  callRoute as Call,
  callTokenRoute as CallToken,
  twilioRoute as Twilio,
  oAuthRoute as OAuth,
  phoneNumberValidationRoute as PhoneNumberValidation,
  userRoute as User,
  contactRoute as Contact,
  allowlistEntryRoute as AllowlistEntry,
  transactionRoute as Transaction,
  featureRoute as Feature,
  periodicCreditRoute as PeriodicCredit,
  middlewares,
};
