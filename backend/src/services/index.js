const models = require('../models');

const User = require('./User');
const Callee = require('./Callee');
const Call = require('./Call');

const userService = User(models.User, models.Callee);
const calleeService = Callee(models.Callee);

module.exports = {
  User: userService,
  Callee: calleeService,
  Call: Call(models.Call, userService, calleeService),
};
