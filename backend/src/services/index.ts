import * as models from '../models';

import Call from './Call';
import TwilioCall from './TwilioCall';
import Transaction from './Transaction';
import Wallet from './Wallet';
import User from './User';
import Contact = require('./Contact');
import AllowlistEntry = require('./AllowlistEntry');
import TwilioClient = require('./TwilioClient');
import Auth0 = require('./Auth0');
import PasswordlessRequest = require('./PasswordlessRequest');

const whitelistEntryService = AllowlistEntry(models.AllowlistEntry);
const userService = User(models.User, whitelistEntryService);
const contactService = Contact(models.Contact, userService);
const twilioCallService = new TwilioCall(models.TwilioCall, TwilioClient);
const passwordlessRequestService = PasswordlessRequest(
  models.PasswordlessRequest
);
const callService = Call(models.Call, userService, contactService);
const auth0Service = Auth0();
const transactionService = new Transaction(
  models.Transaction,
  twilioCallService,
  callService
);
const walletService = new Wallet(models.Wallet, transactionService);

export {
  userService as User,
  contactService as Contact,
  callService as Call,
  whitelistEntryService as AllowlistEntry,
  auth0Service as Auth0,
  twilioCallService as TwilioCall,
  TwilioClient,
  passwordlessRequestService as PasswordlessRequest,
  walletService as Wallet,
  transactionService as Transaction,
};
