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
import Dorm from './Dorm';
import AllowlistEntry from './AllowlistEntry';
import AdminGrantedValidation from './AdminGrantedValidation';
import PhoneNumberValidation from './PhoneNumberValidation';
import WorkpassValidation from './WorkpassValidation';
import OAuth from './OAuth';

const callRoute = Call(services.Call, services.TwilioCall, services.Contact);
const callTokenRoute = CallToken();
const dormRoute = Dorm(services.Dorm);
const twilioRoute = Twilio(services.Call, services.TwilioCall);
const oAuthRoute = OAuth(services.User);
const phoneNumberValidationRoute = PhoneNumberValidation(
  services.User,
  services.Auth0,
  services.PhoneNumberValidation
);
const userRoute = User(
  services.User,
  services.PeriodicCredit,
  services.UserValidation,
  services.Wallet
);
const contactRoute = Contact(services.Contact);
const allowlistEntryRoute = AllowlistEntry(services.AllowlistEntry);
const transactionRoute = Transaction(services.Transaction);
const featureRoute = Feature(services.Feature);
const periodicCreditRoute = PeriodicCredit(services.PeriodicCredit);
const workpassValidationRoute = WorkpassValidation(services.WorkpassValidation);
const adminGrantedValidationRoute = AdminGrantedValidation(
  services.AdminGrantedValidation
);

export {
  allowlistEntryRoute as AllowlistEntry,
  adminGrantedValidationRoute as AdminGrantedValidation,
  callRoute as Call,
  callTokenRoute as CallToken,
  contactRoute as Contact,
  dormRoute as Dorm,
  featureRoute as Feature,
  middlewares,
  oAuthRoute as OAuth,
  periodicCreditRoute as PeriodicCredit,
  phoneNumberValidationRoute as PhoneNumberValidation,
  transactionRoute as Transaction,
  twilioRoute as Twilio,
  userRoute as User,
  workpassValidationRoute as WorkpassValidation,
};
