import {
  AllowNull,
  Column,
  Default,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table
class ValidationState extends Model<ValidationState> {
  @AllowNull(false)
  @Unique
  @Column
  userId: number;

  @Default(false)
  @Column
  isPhoneNumberValidated: boolean;

  @Default(false)
  @Column
  isWorkPassValidated: boolean;
  // TODO: open questions: do we validate work pass uniqueness? FIN uniqueness?
}

export default ValidationState;
export { ValidationState };
