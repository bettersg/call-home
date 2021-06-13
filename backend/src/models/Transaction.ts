import { TransactionReference } from '@call-home/shared/types/Transaction';
import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

// Represents a single transaction that affects a user's wallet.
@Table
class Transaction extends Model<Transaction> {
  @AllowNull(false)
  @Column
  userId: number;

  // A reference for the 'type' of transaction this is. This might have been more aptly named 'referenceCode' or something similar.
  @AllowNull(false)
  @Column(DataType.STRING)
  reference: TransactionReference;

  // Additional information about the event that generated the reference.
  // Because different transaction reference types can have different events, this field is heterogenous and its meaning is dependent on the transaction referece.
  // The values for the different TransactionReference values are enumerated here:
  // 'call' -> the internal id of the TwilioCall that is being charged
  // 'periodic-credit' -> null (TBD)
  // 'admin' -> null (TBD)
  // 'redeemable-code-fb' -> null (TBD)
  @Column(DataType.STRING)
  additionalReference: string | null;

  @AllowNull(false)
  @Column
  amount: number;
}

export default Transaction;
