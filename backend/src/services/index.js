const models = require('../models');

const User = require('./User');
const Contact = require('./Contact');
const Call = require('./Call');
const WhitelistEntry = require('./WhitelistEntry');
const Auth0 = require('./Auth0');

const whitelistEntryService = WhitelistEntry(models.WhitelistEntry);
const userService = User(models.User, whitelistEntryService);
const contactService = Contact(models.Contact);

module.exports = {
  User: userService,
  Contact: contactService,
  Call: Call(models.Call, userService, contactService),
  WhitelistEntry: whitelistEntryService,
  Auth0: Auth0(),
};
