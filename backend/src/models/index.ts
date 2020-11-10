import sequelize from './sequelize';
import AllowlistEntry from './AllowlistEntry';
import Call from './Call';
import Contact from './Contact';
import PasswordlessRequest from './PasswordlessRequest';
import PeriodicCredit from './PeriodicCredit';
import Transaction from './Transaction';
import TwilioCall, { CallStatus } from './TwilioCall';
import User, { UserType } from './User';
import ValidationState from './ValidationState';
import Wallet from './Wallet';

sequelize.addModels([
  AllowlistEntry,
  Call,
  Contact,
  PasswordlessRequest,
  PeriodicCredit,
  Transaction,
  TwilioCall,
  User,
  ValidationState,
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

// PasswordlessRequest <-> User
User.hasMany(PasswordlessRequest, {
  foreignKey: {
    name: 'UserId',
  },
});
PasswordlessRequest.belongsTo(User);

// Wallet <-> User
User.hasOne(Wallet, {
  foreignKey: 'userId',
});
Wallet.belongsTo(User, {
  foreignKey: 'userId',
});

// ValidationState <-> User
User.hasOne(ValidationState, {
  foreignKey: 'userId',
});
ValidationState.belongsTo(User, {
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
  PasswordlessRequest,
  PeriodicCredit,
  Transaction,
  TwilioCall,
  User,
  UserType as UserTypes,
  ValidationState,
  Wallet,
};
