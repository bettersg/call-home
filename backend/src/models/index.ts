import sequelize from './sequelize';
import AllowlistEntry from './AllowlistEntry';
import User, { UserType } from './User';
import Contact from './Contact';
import Call from './Call';
import TwilioCall from './TwilioCall';
import PasswordlessRequest from './PasswordlessRequest';

sequelize.addModels([
  AllowlistEntry,
  Call,
  Contact,
  User,
  TwilioCall,
  PasswordlessRequest,
]);

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

export {
  sequelize,
  User,
  UserType as UserTypes,
  Contact,
  Call,
  AllowlistEntry,
  TwilioCall,
  PasswordlessRequest,
};
