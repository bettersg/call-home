import sequelize from './sequelize';
import AllowlistEntry from './AllowlistEntry';
import Call from './Call';
import Contact from './Contact';
import PeriodicCredit from './PeriodicCredit';
import Transaction from './Transaction';
import TwilioCall, { CallStatus } from './TwilioCall';
import User, { UserType } from './User';
import PhoneNumberValidation from './PhoneNumberValidation';
import Wallet from './Wallet';

sequelize.addModels([
  AllowlistEntry,
  Call,
  Contact,
  PeriodicCredit,
  Transaction,
  TwilioCall,
  User,
  PhoneNumberValidation,
  Wallet,
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

// Wallet <-> User
User.hasOne(Wallet, {
  foreignKey: 'userId',
});
Wallet.belongsTo(User, {
  foreignKey: 'userId',
});

// PhoneNumberValidation <-> User
User.hasOne(PhoneNumberValidation, {
  foreignKey: 'userId',
});
PhoneNumberValidation.belongsTo(User, {
  foreignKey: 'userId',
});

// Transaction <-> User
User.hasMany(Transaction, {
  foreignKey: 'userId',
});
Transaction.belongsTo(User, {
  foreignKey: 'userId',
});

// PeriodicCredit <-> User
User.hasMany(PeriodicCredit, {
  foreignKey: 'userId',
});
PeriodicCredit.belongsTo(User, {
  foreignKey: 'userId',
});

export {
  sequelize,
  AllowlistEntry,
  Call,
  CallStatus,
  Contact,
  PeriodicCredit,
  Transaction,
  TwilioCall,
  User,
  UserType as UserTypes,
  PhoneNumberValidation,
  Wallet,
};
