const models = require('../models');

const User = require('./User');
const Contact = require('./Contact');
const Call = require('./Call');

const userService = User(models.User, models.Contact);
const contactService = Contact(models.Contact);

module.exports = {
  User: userService,
  Contact: contactService,
  Call: Call(models.Call, userService, contactService),
};
