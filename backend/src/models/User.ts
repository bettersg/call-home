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

enum UserType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Table
class User extends Model<User> {
  @AllowNull(false)
  @Column
  name: string;

  @Unique
  @Validate({
    isEmail: {
      msg: 'Email field must have email format',
    },
  })
  @Column
  email: string;

  @Validate({
    isIn: {
      args: [Object.values(UserType)],
      msg: 'Invalid user type specified. Must be ADMIN or USER',
    },
  })
  @AllowNull(false)
  @Default(UserType.USER)
  @Column(DataType.STRING)
  role: UserType;

  @Unique
  @Column
  auth0Id: string;

  @Validate({
    isIn: [['SG', 'BD', '']],
  })
  @Column
  destinationCountry: string;

  // TODO these fields exist just for the backfill job
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

export default User;
export { UserType };
