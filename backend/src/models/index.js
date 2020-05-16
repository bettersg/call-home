const sequelize = require('./sequelize');
const { model: UserModel, UserTypes } = require('./User');
const CalleeModel = require('./Callee');
const CallModel = require('./Call');

const User = UserModel(sequelize);
const Callee = CalleeModel(sequelize);
const Call = CallModel(sequelize);

// User <-> Callee
User.belongsToMany(Callee, { through: 'userCallees' });
Callee.belongsToMany(User, { through: 'userCallees' });

// Call <-> Callee
Call.belongsToMany(Callee, { through: 'callCallees' });
Callee.belongsToMany(Call, { through: 'callCallees' });

// Call <-> User
Call.belongsToMany(User, { through: 'callUsers' });
User.belongsToMany(Call, { through: 'callUsers' });

module.exports = {
  sequelize,
  User,
  UserTypes,
  Callee,
  Call,
};
