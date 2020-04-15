const services = require('../services');

const User = require('./User');
const Call = require('./Call');

module.exports = {
  Call: Call(),
  User: User(services.User),
};
