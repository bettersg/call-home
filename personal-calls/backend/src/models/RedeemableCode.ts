// TODO This doesn't compile for some reason
// import { RedeemableCodeType } from '@call-home/shared/types/RedeemableCode';
import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';

enum RedeemableCodeType {
  FACEBOOK_DORM = 'FACEBOOK_DORM',
}

// Represents a code that can be redeemed by a user.
@Table
class RedeemableCode extends Model<RedeemableCode> {
  @AllowNull(false)
  @Unique
  @Column
  code: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  codeType: RedeemableCodeType;

  // null represents no limit on the number of redemptions.
  @Column(DataType.INTEGER)
  redemptionLimit: number | null;
}

export default RedeemableCode;
export { RedeemableCodeType };
