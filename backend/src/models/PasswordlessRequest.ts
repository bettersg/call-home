import { Model, Table, Column } from 'sequelize-typescript';

@Table
class PasswordlessRequest extends Model<PasswordlessRequest> {
  @Column
  requestTime: Date;
}

export default PasswordlessRequest;
