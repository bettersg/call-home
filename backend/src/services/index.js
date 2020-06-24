const models = require('../models');

const User = require('./User');
const Contact = require('./Contact');
const Call = require('./Call');
const AllowlistEntry = require('./AllowlistEntry');
const Auth0 = require('./Auth0');

const whitelistEntryService = AllowlistEntry(models.AllowlistEntry);
const userService = User(models.User, whitelistEntryService);
const contactService = Contact(models.Contact, userService);

module.exports = {
  User: userService,
  Contact: contactService,
  Call: Call(models.Call, userService, contactService),
  AllowlistEntry: whitelistEntryService,
  Auth0: Auth0(),
};
