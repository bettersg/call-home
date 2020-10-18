import sequelize from './sequelize';
import AllowlistEntry from './AllowlistEntry';
import User, { UserType } from './User';
import Contact from './Contact';
import Call from './Call';
import PeriodicCredit from './PeriodicCredit';
import Transaction from './Transaction';
import Wallet from './Wallet';
import TwilioCall, { CallStatus } from './TwilioCall';
import PasswordlessRequest from './PasswordlessRequest';

sequelize.addModels([
  AllowlistEntry,
  Call,
  Contact,
  User,
  TwilioCall,
  PasswordlessRequest,
  PeriodicCredit,
  Wallet,
  Transaction,
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
  User,
  UserType as UserTypes,
  Contact,
  Call,
  CallStatus,
  AllowlistEntry,
  TwilioCall,
  PasswordlessRequest,
  PeriodicCredit,
  Wallet,
  Transaction,
};
