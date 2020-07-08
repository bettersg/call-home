const models = require('../models');

const User = require('./User');
const Contact = require('./Contact');
const Call = require('./Call');
const AllowlistEntry = require('./AllowlistEntry');
const TwilioCall = require('./TwilioCall');
const TwilioClient = require('./TwilioClient');
const Auth0 = require('./Auth0');
const PasswordlessRequest = require('./PasswordlessRequest');

const whitelistEntryService = AllowlistEntry(models.AllowlistEntry);
const userService = User(models.User, whitelistEntryService);
const contactService = Contact(models.Contact, userService);
const passwordlessRequestService = PasswordlessRequest(
  models.PasswordlessRequest
);

module.exports = {
  User: userService,
  Contact: contactService,
  Call: Call(models.Call, userService, contactService),
  AllowlistEntry: whitelistEntryService,
  Auth0: Auth0(),
  TwilioCall: TwilioCall(models.TwilioCall),
  TwilioClient,
  PasswordlessRequest: passwordlessRequestService,
};
