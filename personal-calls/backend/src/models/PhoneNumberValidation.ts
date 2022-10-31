import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  Table,
  Unique,
  Validate,
} from 'sequelize-typescript';

@Table
class PhoneNumberValidation extends Model<PhoneNumberValidation> {
  @AllowNull(false)
  @Unique
  @Column
  userId: number;

  @Column(DataType.DATE)
  lastRequestTime: Date | null;

  @Validate({
    is: {
      args: [/\+65[0-9]{8}$/],
      msg: 'Phone number should start with +65 and be followed by 8 digits.',
    },
  })
  @Unique
  @Column(DataType.TEXT)
  phoneNumber: string | null;

  @Default(false)
  @Column
  isPhoneNumberValidated: boolean;
}

export default PhoneNumberValidation;
export { PhoneNumberValidation };
