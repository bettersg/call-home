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
import Contact = require('./Contact');
import Auth0 = require('./Auth0');
import PasswordlessRequest = require('./PasswordlessRequest');

// TOPOLOGICAL SORT LOL
const transactionService = new Transaction(models.Transaction);
const passwordlessRequestService = PasswordlessRequest(
  models.PasswordlessRequest
);
const AllowlistEntryService = AllowlistEntry(
  models.AllowlistEntry,
  TwilioClient
);
const auth0Service = Auth0();

const userService = User(models.User, AllowlistEntryService);
const contactService = Contact(models.Contact, userService);
const periodicCreditService = PeriodicCredit(
  models.PeriodicCredit,
  userService,
  transactionService
);
const walletService = new Wallet(models.Wallet, transactionService);
const callService = Call(
  models.Call,
  userService,
  contactService,
  walletService
);
const twilioCallService = new TwilioCall(
  models.TwilioCall,
  TwilioClient,
  callService,
  transactionService
);

export {
  userService as User,
  contactService as Contact,
  callService as Call,
  AllowlistEntryService as AllowlistEntry,
  auth0Service as Auth0,
  twilioCallService as TwilioCall,
  TwilioClient,
  passwordlessRequestService as PasswordlessRequest,
  walletService as Wallet,
  transactionService as Transaction,
  periodicCreditService as PeriodicCredit,
  Feature,
};
