import * as models from '../models';

import Call from './Call';
import PeriodicCredit from './PeriodicCredit';
import TwilioCall from './TwilioCall';
import * as TwilioClient from './TwilioClient';
import Transaction from './Transaction';
import Wallet from './Wallet';
import User from './User';
import * as Feature from './Feature';
import AllowlistEntry from './AllowlistEntry';
import AdminGrantedValidation from './AdminGrantedValidation';
import PhoneNumberValidation from './PhoneNumberValidation';
import DormValidation from './DormValidation';
import WorkpassValidation from './WorkpassValidation';
import * as WorkpassClient from './WorkpassClient';
import UserValidation, { VerificationState } from './UserValidation';
import Dorm from './Dorm';
import Contact = require('./Contact');
import Auth0 = require('./Auth0');

// TOPOLOGICAL SORT LOL
const dormService = Dorm(models.Dorm);
const walletService = Wallet(models.Wallet);
const allowlistEntryService = AllowlistEntry(
  models.AllowlistEntry,
  TwilioClient
);
const auth0Service = Auth0();
const phoneNumberValidationService = PhoneNumberValidation(
  models.PhoneNumberValidation
);
const dormValidationService = DormValidation(
  models.DormValidation,
  dormService
);

const userService = User(
  models.User,
  allowlistEntryService,
  Feature,
  phoneNumberValidationService
);
const contactService = Contact(models.Contact, userService);
const transactionService = Transaction(models.Transaction, walletService);
const periodicCreditService = PeriodicCredit(
  models.PeriodicCredit,
  phoneNumberValidationService,
  transactionService
);
const adminGrantedValidationService = AdminGrantedValidation(
  models.AdminGrantedValidation
);
const workpassValidationService = WorkpassValidation(
  models.WorkpassValidation,
  WorkpassClient
);
const userValidationService = UserValidation(
  adminGrantedValidationService,
  phoneNumberValidationService,
  workpassValidationService
);
const callService = Call(
  models.Call,
  userService,
  contactService,
  userValidationService,
  walletService
);
const twilioCallService = TwilioCall(
  models.TwilioCall,
  TwilioClient,
  callService,
  transactionService
);

export {
  Feature,
  TwilioClient,
  VerificationState,
  WorkpassClient,
  adminGrantedValidationService as AdminGrantedValidation,
  allowlistEntryService as AllowlistEntry,
  auth0Service as Auth0,
  callService as Call,
  contactService as Contact,
  dormService as Dorm,
  dormValidationService as DormValidation,
  periodicCreditService as PeriodicCredit,
  transactionService as Transaction,
  twilioCallService as TwilioCall,
  userService as User,
  userValidationService as UserValidation,
  phoneNumberValidationService as PhoneNumberValidation,
  walletService as Wallet,
  workpassValidationService as WorkpassValidation,
};
