import { AllowNull, Column, Model, Table } from 'sequelize-typescript';

// Represents an instance of a redemption of a RedeemableCode by a user.
@Table
class CodeRedemption extends Model<CodeRedemption> {
  @AllowNull(false)
  @Column
  codeId: number;

  @AllowNull(false)
  @Column
  userId: number;
}

export default CodeRedemption;
