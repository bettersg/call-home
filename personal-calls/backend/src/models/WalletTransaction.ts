import {
  AllowNull,
  Column,
  Default,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';

// Represents the result of applying a transaction to a wallet.
// This table provides a historical view of how the balance in a wallet changes over time.
// This is in contrast to the Wallet table, which only shows the current balance.
// This is also in contrast to the Transaction table, which shows the transactions that should be occurring, but not the actual change in the wallet balance (which may be out of for sync for unknown reasons).
@Table
export class WalletTransaction extends Model<WalletTransaction> {
  @AllowNull(false)
  @Column
  userId: number;

  @Default(0)
  @AllowNull(false)
  @Column
  callTime: number;

  @AllowNull(false)
  @Column
  transactionId: number;
}
