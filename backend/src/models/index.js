const sequelize = require('./sequelize');
const { model: UserModel } = require('./User');
const ContactModel = require('./Contact');
const CallModel = require('./Call');
const WhitelistEntryModel = require('./WhitelistEntry');

const User = UserModel(sequelize);
const Contact = ContactModel(sequelize);
const Call = CallModel(sequelize);
const WhitelistEntry = WhitelistEntryModel(sequelize);

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
  Contact,
  Call,
  WhitelistEntry,
};
