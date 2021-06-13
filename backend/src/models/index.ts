import sequelize from './sequelize';
import AdminGrantedValidation from './AdminGrantedValidation';
import AllowlistEntry from './AllowlistEntry';
import Call from './Call';
import Contact from './Contact';
import Dorm from './Dorm';
import PeriodicCredit from './PeriodicCredit';
import Transaction from './Transaction';
import TwilioCall, { CallStatus } from './TwilioCall';
import User, { UserType } from './User';
import RedeemableCode, { RedeemableCodeType } from './RedeemableCode';
import CodeRedemption from './CodeRedemption';
import DormValidation from './DormValidation';
import PhoneNumberValidation from './PhoneNumberValidation';
import Wallet from './Wallet';
import { WalletTransaction } from './WalletTransaction';
import WorkpassValidation from './WorkpassValidation';

sequelize.addModels([
  AdminGrantedValidation,
  AllowlistEntry,
  Call,
  CodeRedemption,
  Contact,
  Dorm,
  DormValidation,
  PeriodicCredit,
  RedeemableCode,
  Transaction,
  TwilioCall,
  User,
  PhoneNumberValidation,
  Wallet,
  WalletTransaction,
  WorkpassValidation,
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

// WorkpassValidation <-> User
User.hasOne(WorkpassValidation, {
  foreignKey: 'userId',
});
WorkpassValidation.belongsTo(User, {
  foreignKey: 'userId',
});

// DormValidation <-> User
User.hasOne(DormValidation, {
  foreignKey: 'userId',
});
DormValidation.belongsTo(User, {
  foreignKey: 'userId',
});

// AdminGrantedValidation <-> User
User.hasOne(AdminGrantedValidation, {
  foreignKey: 'userId',
});
AdminGrantedValidation.belongsTo(User, {
  foreignKey: 'userId',
});
User.hasMany(AdminGrantedValidation, {
  foreignKey: 'grantedByUserId',
});
AdminGrantedValidation.belongsTo(User, {
  foreignKey: 'grantedByUserId',
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

// CodeRedemption <-> User
User.hasMany(CodeRedemption, {
  foreignKey: 'userId',
});
CodeRedemption.belongsTo(User, {
  foreignKey: 'userId',
});

// CodeRedemption <-> RedeemableCode
RedeemableCode.hasMany(CodeRedemption, {
  foreignKey: 'userId',
});
CodeRedemption.belongsTo(RedeemableCode, {
  foreignKey: 'userId',
});

export {
  sequelize,
  AdminGrantedValidation,
  AllowlistEntry,
  Call,
  CallStatus,
  CodeRedemption,
  Contact,
  Dorm,
  DormValidation,
  PeriodicCredit,
  RedeemableCode,
  RedeemableCodeType,
  Transaction,
  TwilioCall,
  User,
  UserType as UserTypes,
  PhoneNumberValidation,
  Wallet,
  WalletTransaction,
  WorkpassValidation,
};
