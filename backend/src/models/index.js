const sequelize = require('./sequelize');
const { model: UserModel, UserTypes } = require('./User');
const ContactModel = require('./Contact');
const CallModel = require('./Call');
const AllowlistEntryModel = require('./AllowlistEntry');

const User = UserModel(sequelize);
const Contact = ContactModel(sequelize);
const Call = CallModel(sequelize);
const AllowlistEntry = AllowlistEntryModel(sequelize);

// User <-> Contact
User.hasMany(Contact, {
  foreignKey: {
    name: 'UserId',
  },
});
Contact.belongsTo(User);

// Call <-> Contact
Call.belongsToMany(Contact, { through: 'callContacts' });
Contact.belongsToMany(Call, { through: 'callContacts' });

// Call <-> User
Call.belongsToMany(User, { through: 'callUsers' });
User.belongsToMany(Call, { through: 'callUsers' });

module.exports = {
  sequelize,
  User,
  UserTypes,
  Contact,
  Call,
  AllowlistEntry,
};
