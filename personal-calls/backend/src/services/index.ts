import * as models from '../models';

import Call from './Call';
import PeriodicCredit from './PeriodicCredit';
import TwilioCall from './TwilioCall';
import * as TwilioClient from './TwilioClient';
import Transaction from './Transaction';
import Wallet from './Wallet';
import User from './User';
import * as Feature from './Feature';
import AllowlistEntry from './AllowlistEntry';
import RedeemableCode from './RedeemableCode';
import CodeRedemption from './CodeRedemption';
import AdminGrantedValidation from './AdminGrantedValidation';
import PhoneNumberValidation from './PhoneNumberValidation';
import DormValidation from './DormValidation';
import FinValidation, { FinValidationService } from './FinValidation';
import WorkpassValidation from './WorkpassValidation';
import * as WorkpassClient from './WorkpassClient';
import UserValidation, { VerificationState } from './UserValidation';
import FacebookDormCodeRedemption from './FacebookDormCodeRedemption';
import Dorm from './Dorm';
import UserExperimentConfig from './UserExperimentConfig';
import { CredentialSet, CredentialSets } from './TwilioCreds';
import Contact = require('./Contact');
import PhoneLogin from './PhoneLogin';

// TOPOLOGICAL SORT LOL
const phoneLoginService = PhoneLogin(Feature, TwilioClient);

const dormService = Dorm(models.Dorm);
const walletService = Wallet(models.Wallet, models.WalletTransaction);
const redeemableCodeService = RedeemableCode(models.RedeemableCode);

const finValidationService = FinValidationService(models.FinValidation);
const allowlistEntryService = AllowlistEntry(
  models.AllowlistEntry,
  TwilioClient
);
const phoneNumberValidationService = PhoneNumberValidation(
  models.PhoneNumberValidation
);
const dormValidationService = DormValidation(
  models.DormValidation,
  dormService
);

const userService = User(
  models.User,
  allowlistEntryService,
  Feature,
  phoneNumberValidationService
);
const contactService = Contact(models.Contact, userService);
const transactionService = Transaction(models.Transaction, walletService);
const periodicCreditService = PeriodicCredit(
  models.PeriodicCredit,
  models.Wallet,
  Feature,
  transactionService
);
const adminGrantedValidationService = AdminGrantedValidation(
  models.AdminGrantedValidation
);
const workpassValidationService = WorkpassValidation(
  models.WorkpassValidation,
  WorkpassClient
);
const userValidationService = UserValidation(
  Feature,
  adminGrantedValidationService,
  dormValidationService,
  phoneNumberValidationService,
  finValidationService,
  workpassValidationService
);
const callService = Call(
  models.Call,
  userService,
  contactService,
  userValidationService,
  walletService
);
const twilioCallService = TwilioCall(
  models.TwilioCall,
  TwilioClient,
  callService,
  transactionService
);

const codeRedemptionService = CodeRedemption(
  models.CodeRedemption,
  redeemableCodeService
);

const facebookDormCodeRedemptionService = FacebookDormCodeRedemption(
  codeRedemptionService,
  redeemableCodeService,
  dormValidationService,
  transactionService
);

const userExperimentConfigService = UserExperimentConfig(
  models.UserExperimentConfig
);

export {
  Feature,
  TwilioClient,
  VerificationState,
  WorkpassClient,
  adminGrantedValidationService as AdminGrantedValidation,
  allowlistEntryService as AllowlistEntry,
  phoneLoginService as PhoneLogin,
  callService as Call,
  codeRedemptionService as CodeRedemption,
  contactService as Contact,
  dormService as Dorm,
  dormValidationService as DormValidation,
  facebookDormCodeRedemptionService as FacebookDormCodeRedemption,
  finValidationService as FinValidation,
  periodicCreditService as PeriodicCredit,
  redeemableCodeService as RedeemableCode,
  transactionService as Transaction,
  twilioCallService as TwilioCall,
  userService as User,
  userExperimentConfigService as UserExperimentConfig,
  userValidationService as UserValidation,
  phoneNumberValidationService as PhoneNumberValidation,
  walletService as Wallet,
  workpassValidationService as WorkpassValidation,
  CredentialSet,
  CredentialSets,
};
