import {
  AllowNull,
  Column,
  Model,
  Table,
  Unique,
  DataType,
} from 'sequelize-typescript';

@Table
class DormValidation extends Model<DormValidation> {
  @AllowNull(false)
  @Unique
  @Column
  userId: number;

  // null is a special case for dormId: it means that the user is not a resident of any of our listed dorms.
  // Because this is nullable, this is not an acceptable foreign key.
  @Column(DataType.INTEGER)
  dormId: number | null;
}

export default DormValidation;
export { DormValidation };
