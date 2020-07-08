const services = require('../services');

const User = require('./User');
const Contact = require('./Contact');
const Call = require('./Call');
const Twilio = require('./Twilio');
const OAuth = require('./OAuth');
const AllowlistEntry = require('./AllowlistEntry');
const Passwordless = require('./Passwordless');
const middlewares = require('./middlewares');

module.exports = {
  Call: Call(),
  Twilio: Twilio(services.Call, services.TwilioCall),
  OAuth: OAuth(),
  Passwordless: Passwordless(
    services.User,
    services.Auth0,
    services.PasswordlessRequest
  ),
  User: User(services.User),
  Contact: Contact(services.Contact),
  AllowlistEntry: AllowlistEntry(services.AllowlistEntry),
  middlewares,
};
