import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table
class WorkpassValidation extends Model<WorkpassValidation> {
  @AllowNull(false)
  @Unique
  @Column
  userId: number;

  // sha256 of the given serial number. sha256 is considered preimage resistant, which is exactly what we want i.e. we don't want to be able to generate a valid serial number given its hash value.
  // More specifically, this is the bas64 encoding of the utf8 encoding of the serial number.
  @Unique
  @Column(DataType.TEXT)
  serialNumberSha256: string | null;

  // Expiry date of the workpass. Currently has day-level granularity.
  @Column(DataType.DATE)
  expiryDate: Date | null;

  // The date when the workpass information was attempted to be fetched. Used to rate limit.
  @Column(DataType.DATE)
  lastRequestTime: Date | null;

  // The date when the workpass information was most recently fetched.
  @Column(DataType.DATE)
  lastFetched: Date | null;

  @Default(false)
  @Column
  isWorkpassValidated: boolean;
}

export default WorkpassValidation;
export { WorkpassValidation };
