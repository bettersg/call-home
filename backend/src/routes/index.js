const services = require('../services');

const User = require('./User');
const Call = require('./Call');
const OAuth = require('./OAuth');

module.exports = {
  Call: Call(),
  OAuth: OAuth(),
  User: User(services.User),
};
