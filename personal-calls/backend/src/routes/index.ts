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
import DormValidation from './DormValidation';
import FinValidation from './FinValidation';
import PhoneNumberValidation from './PhoneNumberValidation';
import WorkpassValidation from './WorkpassValidation';
import FacebookDormCode from './FacebookDormCode';
import OAuth from './OAuth';

const callRoute = Call(services.Call, services.TwilioCall, services.Contact);
const callTokenRoute = CallToken(services.Feature, services.CredentialSets);
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
const featureRoute = Feature(services.Feature, services.UserExperimentConfig);
const periodicCreditRoute = PeriodicCredit(services.PeriodicCredit);
const workpassValidationRoute = WorkpassValidation(services.WorkpassValidation);
const dormValidationRoute = DormValidation(services.DormValidation);
const adminGrantedValidationRoute = AdminGrantedValidation(
  services.AdminGrantedValidation
);
const facebookDormCode = FacebookDormCode(
  services.FacebookDormCodeRedemption,
  services.RedeemableCode
);
const finValidationRoute = FinValidation(services.FinValidation);

export {
  allowlistEntryRoute as AllowlistEntry,
  adminGrantedValidationRoute as AdminGrantedValidation,
  callRoute as Call,
  callTokenRoute as CallToken,
  contactRoute as Contact,
  dormRoute as Dorm,
  dormValidationRoute as DormValidation,
  facebookDormCode as FacebookDormCode,
  featureRoute as Feature,
  finValidationRoute as FinValidation,
  middlewares,
  oAuthRoute as OAuth,
  periodicCreditRoute as PeriodicCredit,
  phoneNumberValidationRoute as PhoneNumberValidation,
  transactionRoute as Transaction,
  twilioRoute as Twilio,
  userRoute as User,
  workpassValidationRoute as WorkpassValidation,
};
