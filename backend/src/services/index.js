const models = require('../models');

const User = require('./User');

module.exports = {
  User: User(models.User),
};
