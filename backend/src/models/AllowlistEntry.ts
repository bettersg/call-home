import {
  AllowNull,
  Column,
  Default,
  Model,
  Table,
  Unique,
  Validate,
  NotEmpty,
} from 'sequelize-typescript';
import { UserType } from './User';

// Allowlists a number for our pilot
@Table
class AllowlistEntry extends Model<AllowlistEntry> {
  @Validate({
    is: {
      args: [/\+65[0-9]{8}$/],
      msg: 'Phone number should start with +65 and be followed by 8 digits.',
    },
  })
  @Unique
  @AllowNull(false)
  @Column
  phoneNumber: string;

  @Default(UserType.USER)
  @Validate({
    isIn: {
      args: [Object.values(UserType)],
      msg: 'Invalid user type specified. Must be ADMIN or USER',
    },
  })
  @AllowNull(false)
  @NotEmpty
  @Column
  role: string;

  @Validate({
    isIn: [['SG', 'BD', '']],
  })
  @AllowNull(false)
  @NotEmpty
  @Column
  destinationCountry: string;
}

export default AllowlistEntry;
