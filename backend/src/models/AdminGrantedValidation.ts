import { AllowNull, Column, Model, Table, Unique } from 'sequelize-typescript';

// Represents a grant from an admin to use Call Home.
@Table
class AdminGrantedValidation extends Model<AdminGrantedValidation> {
  @AllowNull(false)
  @Unique
  @Column
  userId: number;

  @AllowNull(false)
  @Column
  grantedByUserId: number;
}

export default AdminGrantedValidation;
export { AdminGrantedValidation };
