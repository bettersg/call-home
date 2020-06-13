const services = require('../services');

const User = require('./User');
const Contact = require('./Contact');
const Call = require('./Call');
const Twilio = require('./Twilio');
const OAuth = require('./OAuth');
const Passwordless = require('./Passwordless');
const middlewares = require('./middlewares');

module.exports = {
  Call: Call(),
  Twilio: Twilio(services.Call),
  OAuth: OAuth(),
  Passwordless: Passwordless(),
  User: User(services.User),
  Contact: Contact(services.Contact),
  middlewares,
};
