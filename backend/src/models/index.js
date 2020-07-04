const sequelize = require('./sequelize');
const { model: UserModel, UserTypes } = require('./User');
const ContactModel = require('./Contact');
const CallModel = require('./Call');
const TwilioCallModel = require('./TwilioCall');
const AllowlistEntryModel = require('./AllowlistEntry');
const PasswordlessRequestModel = require('./PasswordlessRequest');

const User = UserModel(sequelize);
const Contact = ContactModel(sequelize);
const Call = CallModel(sequelize);
const AllowlistEntry = AllowlistEntryModel(sequelize);
const TwilioCall = TwilioCallModel(sequelize);
const PasswordlessRequest = PasswordlessRequestModel(sequelize);

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

// PasswordlessRequest <-> User
User.hasMany(PasswordlessRequest, {
  foreignKey: {
    name: 'UserId',
  },
});
PasswordlessRequest.belongsTo(User);

module.exports = {
  sequelize,
  User,
  UserTypes,
  Contact,
  Call,
  AllowlistEntry,
  TwilioCall,
  PasswordlessRequest,
};
