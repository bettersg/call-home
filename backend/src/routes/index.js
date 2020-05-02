const services = require('../services');

const User = require('./User');
const Callee = require('./Callee');
const Call = require('./Call');
const Twilio = require('./Twilio');
const OAuth = require('./OAuth');
const middlewares = require('./middlewares');

module.exports = {
  Call: Call(),
  Twilio: Twilio(services.Call),
  OAuth: OAuth(),
  User: User(services.User),
  Callee: Callee(services.Callee),
  middlewares,
};
