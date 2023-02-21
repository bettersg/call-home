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
class FinValidation extends Model<FinValidation> {
  @AllowNull(false)
  @Unique
  @Column
  userId: number;

  // sha256 of the given FIN. sha256 is considered preimage resistant, which is
  // exactly what we want i.e. we don't want to be able to generate a valid FIN
  // given its hash value. More specifically, this is the bas64 encoding of the
  // utf8 encoding of the FIN.
  // This is the same approach taken for work pass serial numbers.
  @Unique
  @Column(DataType.TEXT)
  finSha256: string | null;

  @Default(false)
  @Column
  isFinValidated: boolean;
}

export default FinValidation;
export { FinValidation };
