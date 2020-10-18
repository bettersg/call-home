import { AllowNull, Column, Model, Table } from 'sequelize-typescript';

// Represents a single periodic credit to a user
@Table
class PeriodicCredit extends Model<PeriodicCredit> {
  @AllowNull(false)
  @Column
  userId: number;

  @AllowNull(false)
  @Column
  amount: number;
}

export default PeriodicCredit;
