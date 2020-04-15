const sequelize = require('./sequelize');
const User = require('./User');

module.exports = {
  User: User(sequelize),
};
