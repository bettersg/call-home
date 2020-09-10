import * as models from '../models';

import Call from './Call';
import TwilioCall from './TwilioCall';
import User = require('./User');
import Contact = require('./Contact');
import AllowlistEntry = require('./AllowlistEntry');
import TwilioClient = require('./TwilioClient');
import Auth0 = require('./Auth0');
import PasswordlessRequest = require('./PasswordlessRequest');

const whitelistEntryService = AllowlistEntry(models.AllowlistEntry);
const userService = User(models.User, whitelistEntryService);
const contactService = Contact(models.Contact, userService);
const twilioCallService = TwilioCall(models.TwilioCall);
const passwordlessRequestService = PasswordlessRequest(
  models.PasswordlessRequest
);
const callService = Call(models.Call, userService, contactService);
const auth0Service = Auth0();

export {
  userService as User,
  contactService as Contact,
  callService as Call,
  whitelistEntryService as AllowlistEntry,
  auth0Service as Auth0,
  twilioCallService as TwilioCall,
  TwilioClient,
  passwordlessRequestService as PasswordlessRequest,
};
