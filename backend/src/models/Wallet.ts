import {
  AllowNull,
  Column,
  Default,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';

// Represents the balance of how much call time a user has. Essentially a flattened view of all of a user's transactions
@Table
class Wallet extends Model<Wallet> {
  @AllowNull(false)
  @Unique
  @Column
  userId: number;

  @Default(0)
  @AllowNull(false)
  @Column
  callTime: number;
}

export default Wallet;
