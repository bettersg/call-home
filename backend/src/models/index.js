const sequelize = require('./sequelize');
const { model: UserModel, UserTypes } = require('./User');
const CalleeModel = require('./Callee');
const CallModel = require('./Call');

const User = UserModel(sequelize);
const Callee = CalleeModel(sequelize);
const Call = CallModel(sequelize);

User.belongsToMany(Callee, { through: 'userCallees' });
Callee.belongsToMany(User, { through: 'userCallees' });

module.exports = {
  sequelize,
  User,
  UserTypes,
  Callee,
  Call,
};
